package grpc

import (
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"github.com/abarbarov/nabu/tools"
	"github.com/golang/protobuf/ptypes/timestamp"
	"log"
	"sync/atomic"
	"time"
)

type nabuGrpcService struct {
	github    *github.Github
	terraform *terraformApi
	store     *store.DataStore
	builder   *builder.Builder
}

type terraformApi struct {
}

func NewNabuGrpcService(store *store.DataStore, github *github.Github, builder *builder.Builder) *nabuGrpcService {
	return &nabuGrpcService{github, &terraformApi{}, store, builder}
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
	defer close(branches)

	if err != nil {
		return err
	}

	for c := range branches {
		stream.Send(&pb.ListBranchesResponse{
			Branch: &pb.Branch{
				Name: c.Name,
			},
		})
	}

	return nil
}

func (ngs *nabuGrpcService) ListCommits(req *pb.CommitsRequest, resp pb.NabuService_ListCommitsServer) error {
	proj, err := ngs.store.Project(req.RepoId)
	if err != nil {
		return err
	}

	commits, err := ngs.github.Commits(proj.Repository.Token, proj.Repository.Owner, proj.Repository.Name, req.BranchName)
	defer close(commits)

	if err != nil {
		return err
	}

	for c := range commits {
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
	go ngs.builder.Copy(proj.Repository.Owner, proj.Repository.Name, req.Sha, messages)
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
	go ngs.builder.Install(proj.Repository.Owner, proj.Repository.Name, req.Sha, req.Color, proj.Exec, proj.Dir, messages)
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
