package grpc

import (
	"context"
	"github.com/abarbarov/nabu/auth"
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"github.com/abarbarov/nabu/tools"
	"github.com/dgrijalva/jwt-go"
	"github.com/golang/protobuf/ptypes/timestamp"
	"log"
	"sync/atomic"
	"time"
)

type nabuGrpcService struct {
	github        *github.Github
	store         *store.DataStore
	builder       *builder.Builder
	authenticator *auth.Authenticator
}

func NewNabuGrpcService(store *store.DataStore, github *github.Github, builder *builder.Builder, auth *auth.Authenticator) *nabuGrpcService {
	return &nabuGrpcService{github, store, builder, auth}
}

func (ngs *nabuGrpcService) ListProjects(req *pb.EmptyRequest, stream pb.NabuService_ListProjectsServer) error {

	projects, err := ngs.Projects()
	defer close(projects)

	if err != nil {
		return err
	}
	for project := range projects {
		if err := stream.Send(&pb.ListProjectsResponse{Project: project}); err != nil {
			return err
		}
	}

	return nil
}

func (ngs *nabuGrpcService) ListBranches(req *pb.BranchRequest, stream pb.NabuService_ListBranchesServer) error {
	proj, err := ngs.store.Project(req.RepoId)
	if err != nil {
		return err
	}

	branches, err := ngs.github.Branches(proj.Repository.Token, proj.Repository.Owner, proj.Repository.Name)

	if err != nil {
		return err
	}

	for _, c := range branches {
		err = stream.Send(&pb.ListBranchesResponse{
			Branch: &pb.Branch{
				Name: c.Name,
			},
		})

		if err != nil {
			return err
		}
	}

	return nil
}

func (ngs *nabuGrpcService) Authenticate(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	user, err := ngs.store.User(req.Username)

	if err != nil || req.Password != user.Hash {
		return &pb.AuthResponse{
			Errors: []*pb.Error{
				{
					Text:  "Wrong username or password",
					Code:  1,
					Field: "username;password",
				},
			},
		}, nil
	}

	claims := auth.CustomClaims{
		State: auth.RandToken(),
		StandardClaims: jwt.StandardClaims{
			Id:        auth.RandToken(),
			Issuer:    "nabu.app",
			ExpiresAt: time.Now().Add(60 * time.Minute).Unix(),
			NotBefore: time.Now().Add(-1 * time.Minute).Unix(),
		},
		User: user,
	}

	token, err := ngs.authenticator.Token(&claims)
	if err != nil {
		return &pb.AuthResponse{
			Errors: []*pb.Error{
				{
					Text:  "Cannot create token",
					Code:  1,
					Field: "",
				},
			},
		}, nil
	}

	return &pb.AuthResponse{
		User: &pb.User{
			Id:    user.Id,
			Token: token,
		},
	}, nil
}

func (ngs *nabuGrpcService) Register(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	user, err := ngs.store.AddUser(req.Username, req.Password)

	if err != nil {
		return &pb.AuthResponse{
			Errors: []*pb.Error{
				{
					Text:  "Cannot create user",
					Code:  2,
					Field: "",
				},
			},
		}, nil
	}

	claims := auth.CustomClaims{
		State: auth.RandToken(),
		StandardClaims: jwt.StandardClaims{
			Id:        auth.RandToken(),
			Issuer:    "nabu.app",
			ExpiresAt: time.Now().Add(60 * time.Minute).Unix(),
			NotBefore: time.Now().Add(-1 * time.Minute).Unix(),
		},
		User: user,
	}

	token, err := ngs.authenticator.Token(&claims)

	return &pb.AuthResponse{
		User: &pb.User{
			Id:    user.Id,
			Token: token,
		},
	}, nil
}

func (ngs *nabuGrpcService) RefreshToken(ctx context.Context, req *pb.EmptyRequest) (*pb.AuthResponse, error) {
	return &pb.AuthResponse{
		User: &pb.User{
			Id:    1,
			Token: "super-token",
		},
	}, nil
}

func (ngs *nabuGrpcService) ListCommits(req *pb.CommitsRequest, resp pb.NabuService_ListCommitsServer) error {
	proj, err := ngs.store.Project(req.RepoId)
	if err != nil {
		return err
	}

	commits, err := ngs.github.Commits(proj.Repository.Token, proj.Repository.Owner, proj.Repository.Name, req.BranchName)

	if err != nil {
		return err
	}

	for _, c := range commits {
		resp.Send(&pb.ListCommitsResponse{
			Commit: &pb.Commit{
				Sha:     c.SHA,
				Message: tools.RemoveComments(c.Message),
				Timestamp: &timestamp.Timestamp{
					Seconds: c.Date.Unix(),
				},
			},
		})
	}

	return nil
}

func (ngs *nabuGrpcService) Build(req *pb.BuildRequest, stream pb.NabuService_BuildServer) error {
	proj, err := ngs.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages := make(chan *builder.Message)
	go ngs.builder.Build(proj.Repository.Token, proj.Repository.Owner, proj.Repository.Name, req.Branch, req.Sha, messages)
	defer close(messages)

	var ticker int64 = 0

	for {
		select {
		case message, ok := <-messages:
			log.Printf("[INFO] %v", message.Text)
			if !ok {
				return nil
			}

			atomic.SwapInt64(&ticker, message.Id+1)

			stream.Send(&pb.MessageResponse{
				Message: &pb.Message{
					Id: message.Id,
					Timestamp: &timestamp.Timestamp{
						Seconds: message.Timestamp.Unix(),
					},
					Message: message.Text,
					Status:  convertStatus(message.Status),
				},
			})

			if message.Close {
				return nil
			}
		default:
			id := atomic.LoadInt64(&ticker)
			if id > 0 {
				stream.Send(&pb.MessageResponse{
					Message: &pb.Message{
						Id: id,
						Timestamp: &timestamp.Timestamp{
							Seconds: time.Now().Unix(),
						},
						Message: ".",
						Status:  pb.StatusType_PENDING,
					},
				})
			}

			time.Sleep(1000 * time.Millisecond)
		}
	}
}

func (ngs *nabuGrpcService) Projects() (chan *pb.Project, error) {
	output := make(chan *pb.Project)

	projects, err := ngs.store.Projects()
	if err != nil {
		log.Printf("%v", err)
	}
	for _, p := range projects {
		go func(p *store.Project) {
			project := &pb.Project{
				Id:         p.Id,
				Title:      p.Title,
				Repository: p.Repository.Name,
			}

			output <- project
		}(p)
	}

	return output, nil
}

func (ngs *nabuGrpcService) Copy(req *pb.CopyRequest, stream pb.NabuService_CopyServer) error {
	proj, err := ngs.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages := make(chan *builder.Message)
	go ngs.builder.Copy(*proj, req.Sha, messages)
	defer close(messages)

	var ticker int64 = 0

	for {
		select {
		case message, ok := <-messages:
			log.Printf("[INFO] %v", message.Text)
			if !ok {
				return nil
			}

			atomic.SwapInt64(&ticker, message.Id+1)

			stream.Send(&pb.MessageResponse{
				Message: &pb.Message{
					Id: message.Id,
					Timestamp: &timestamp.Timestamp{
						Seconds: message.Timestamp.Unix(),
					},
					Message: message.Text,
					Status:  convertStatus(message.Status),
				},
			})

			if message.Close {
				return nil
			}
		default:
			id := atomic.LoadInt64(&ticker)
			if id > 0 {
				stream.Send(&pb.MessageResponse{
					Message: &pb.Message{
						Id: id,
						Timestamp: &timestamp.Timestamp{
							Seconds: time.Now().Unix(),
						},
						Message: ".",
						Status:  pb.StatusType_PENDING,
					},
				})
			}

			time.Sleep(1000 * time.Millisecond)
		}
	}
}

func (ngs *nabuGrpcService) Install(req *pb.InstallRequest, stream pb.NabuService_InstallServer) error {
	proj, err := ngs.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages := make(chan *builder.Message)
	go ngs.builder.Install(*proj, req.Sha, req.Color, messages)
	defer close(messages)

	var ticker int64 = 0

	for {
		select {
		case message, ok := <-messages:
			log.Printf("[INFO] %v", message.Text)
			if !ok {
				return nil
			}

			atomic.SwapInt64(&ticker, message.Id+1)

			stream.Send(&pb.MessageResponse{
				Message: &pb.Message{
					Id: message.Id,
					Timestamp: &timestamp.Timestamp{
						Seconds: message.Timestamp.Unix(),
					},
					Message: message.Text,
					Status:  convertStatus(message.Status),
				},
			})

			if message.Close {
				return nil
			}
		default:
			id := atomic.LoadInt64(&ticker)
			if id > 0 {
				stream.Send(&pb.MessageResponse{
					Message: &pb.Message{
						Id: id,
						Timestamp: &timestamp.Timestamp{
							Seconds: time.Now().Unix(),
						},
						Message: ".",
						Status:  pb.StatusType_PENDING,
					},
				})
			}

			time.Sleep(1000 * time.Millisecond)
		}
	}
}

func (ngs *nabuGrpcService) Restart(req *pb.RestartRequest, stream pb.NabuService_RestartServer) error {
	proj, err := ngs.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages := make(chan *builder.Message)
	go ngs.builder.Restart(*proj, req.Sha, req.Color, messages)
	defer close(messages)

	var ticker int64 = 0

	for {
		select {
		case message, ok := <-messages:
			log.Printf("[INFO] %v", message.Text)
			if !ok {
				return nil
			}

			atomic.SwapInt64(&ticker, message.Id+1)

			stream.Send(&pb.MessageResponse{
				Message: &pb.Message{
					Id: message.Id,
					Timestamp: &timestamp.Timestamp{
						Seconds: message.Timestamp.Unix(),
					},
					Message: message.Text,
					Status:  convertStatus(message.Status),
				},
			})

			if message.Close {
				return nil
			}
		default:
			id := atomic.LoadInt64(&ticker)
			if id > 0 {
				stream.Send(&pb.MessageResponse{
					Message: &pb.Message{
						Id: id,
						Timestamp: &timestamp.Timestamp{
							Seconds: time.Now().Unix(),
						},
						Message: ".",
						Status:  pb.StatusType_PENDING,
					},
				})
			}

			time.Sleep(1000 * time.Millisecond)
		}
	}
}

func convertStatus(status int) pb.StatusType {
	switch status {
	case 1:
		return pb.StatusType_SUCCESS
	case 2:
		return pb.StatusType_ERROR
	case 3:
		return pb.StatusType_WARNING
	default:
		return pb.StatusType_UNKNOWN
	}
}
