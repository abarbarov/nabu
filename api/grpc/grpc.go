package grpc

import (
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"github.com/golang/protobuf/ptypes/timestamp"
	"golang.org/x/net/context"
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

func (ngs *nabuGrpcService) CreateProject(ctx context.Context, req *pb.CreateProjectRequest) (*pb.ListProjectsResponse, error) {
	return &pb.ListProjectsResponse{}, nil
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

func (ngs *nabuGrpcService) ListCommits(req *pb.ProjectRequest, resp pb.NabuService_ListCommitsServer) error {
	repo, err := ngs.store.Project(req.Id)
	if err != nil {
		return err
	}

	commits, err := ngs.github.Commits("d14813a8df45fa3d136e3fd6690a49b780268978", repo.Repository.Owner, repo.Repository.Name, "master")
	defer close(commits)

	if err != nil {
		return err
	}

	for c := range commits {
		resp.Send(&pb.ListCommitsResponse{
			Commit: &pb.Commit{
				Sha:     c.SHA,
				Message: c.Message,
			},
		})
	}

	return nil
}

func (ngs *nabuGrpcService) Build(req *pb.BuildRequest, stream pb.NabuService_BuildServer) error {
	repo, err := ngs.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages := make(chan *builder.Message)
	go ngs.builder.Build(repo.Repository.Token, repo.Repository.Owner, repo.Repository.Name, "master", req.Sha, messages)
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

			stream.Send(&pb.BuildResponse{
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
				stream.Send(&pb.BuildResponse{
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
