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

	claims := createUserClaims(user)
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

	claims := createUserClaims(user)
	token, err := ngs.authenticator.Token(&claims)

	return &pb.AuthResponse{
		User: &pb.User{
			Id:    user.Id,
			Token: token,
		},
	}, nil
}

func (ngs *nabuGrpcService) RefreshToken(ctx context.Context, req *pb.EmptyRequest) (*pb.AuthResponse, error) {
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return nil, err
	}

	newClaims := createUserClaims(claims.User)
	token, err := ngs.authenticator.Token(&newClaims)

	return &pb.AuthResponse{
		User: &pb.User{
			Id:    claims.User.Id,
			Token: token,
		},
	}, nil
}

func (ngs *nabuGrpcService) ListProjects(req *pb.EmptyRequest, stream pb.NabuService_ListProjectsServer) error {
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	timeout := make(chan bool, 1)
	go func() {
		time.Sleep(5 * time.Second)
		timeout <- true
	}()

	projects := make(chan *pb.Project)
	err = ngs.projects(claims.User.Id, projects)

	if err != nil {
		return err
	}

	defer close(projects)
	for {
		select {
		case p, _ := <-projects:
			if err := stream.Send(&pb.ListProjectsResponse{Project: p}); err != nil {
				return err
			}
		case <-timeout:
			return nil
		}
	}

	//
	//time.AfterFunc(time.Second*10, func() {
	//	close(projects)
	//})

	//for project := range projects {
	//	if err := stream.Send(&pb.ListProjectsResponse{Project: project}); err != nil {
	//		return err
	//	}
	//}
	//
	return nil
}

func (ngs *nabuGrpcService) ListBranches(req *pb.BranchRequest, stream pb.NabuService_ListBranchesServer) error {
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.RepoId)
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

func (ngs *nabuGrpcService) ListCommits(req *pb.CommitsRequest, resp pb.NabuService_ListCommitsServer) error {
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.RepoId)
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
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.ProjectId)
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

func (ngs *nabuGrpcService) Copy(req *pb.CopyRequest, stream pb.NabuService_CopyServer) error {
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.ProjectId)
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
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.ProjectId)
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
	claims, err := ngs.authenticator.Parse(req.Token)

	if err != nil {
		return err
	}

	proj, err := ngs.store.Project(claims.User.Id, req.ProjectId)
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

func (ngs *nabuGrpcService) projects(userId int64, output chan *pb.Project) error {

	projects, err := ngs.store.Projects(userId)
	if err != nil {
		log.Printf("%v", err)
	}

	//ch := make(chan  *pb.Project)
	//for _, conn := range projects {
	//	go func(c Conn) {
	//		select {
	//		case ch <- c.DoQuery(query):
	//		default:
	//		}
	//	}(conn)
	//}
	//return <-ch
	//

	for _, p := range projects {
		go func(p *store.Project) {
			project := &pb.Project{
				Id:         p.Id,
				Title:      p.Title,
				Repository: p.Repository.Name,
				Owner:      p.Repository.Owner,
			}

			output <- project
		}(p)
	}

	return nil
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

func createUserClaims(user *store.User) auth.CustomClaims {
	claims := auth.CustomClaims{
		State: auth.RandToken(),
		StandardClaims: jwt.StandardClaims{
			Id:        auth.RandToken(),
			Issuer:    "nabu.app",
			ExpiresAt: time.Now().Add(60 * time.Minute).Unix(),
			NotBefore: time.Now().Add(-1 * time.Minute).Unix(),
		},
		User: &store.User{
			Id: user.Id,
		},
	}

	return claims
}
