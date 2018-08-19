package grpc

import (
	"github.com/abarbarov/nabu/builder"
	"github.com/abarbarov/nabu/github"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"golang.org/x/net/context"
	"log"
)

type nabuGrpcService struct {
	github    *github.Github
	terraform *terraformApi
	store     *store.DataStore
	builder   *builder.Builder
}

type terraformApi struct {
}

func NewNabuGrpcService(s *store.DataStore, g *github.Github, b *builder.Builder) *nabuGrpcService {
	github := g
	builder := b
	terraform := &terraformApi{}
	store := s

	return &nabuGrpcService{github, terraform, store, builder}
}

func (s *nabuGrpcService) ListProjects(req *pb.EmptyRequest, resp pb.NabuService_ListProjectsServer) error {
	projects, err := s.Projects()
	defer close(projects)
	if err != nil {
		return err
	}
	for project := range projects {
		resp.Send(&pb.ListProjectsResponse{
			Project: project,
		})
	}

	return nil
}

func (s *nabuGrpcService) CreateProject(ctx context.Context, req *pb.CreateProjectRequest) (*pb.ListProjectsResponse, error) {
	return &pb.ListProjectsResponse{}, nil
}

func (s *nabuGrpcService) Projects() (chan *pb.Project, error) {
	output := make(chan *pb.Project)

	projects, err := s.store.Projects()
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

func (s *nabuGrpcService) ListCommits(req *pb.ProjectRequest, resp pb.NabuService_ListCommitsServer) error {
	repo, err := s.store.Project(req.Id)
	if err != nil {
		return err
	}

	commits, err := s.Commits(repo.Repository.Owner, repo.Repository.Name, "master")
	defer close(commits)

	if err != nil {
		return err
	}

	for commit := range commits {
		resp.Send(&pb.ListCommitsResponse{
			Commit: commit,
		})
	}

	return nil
}

func (s *nabuGrpcService) Commits(owner, name, branch string) (chan *pb.Commit, error) {
	output := make(chan *pb.Commit)

	token := "d14813a8df45fa3d136e3fd6690a49b780268978"
	commits, err := s.github.Commits(token, owner, name, branch)

	if err != nil {
		log.Printf("%v", err)
	}

	for _, c := range commits {
		go func(c *github.Commit) {
			commit := &pb.Commit{
				Sha:     c.SHA,
				Message: c.Message,
				Id:      1,
				//Timestamp: c.Date,
			}
			output <- commit
		}(c)
	}

	return output, nil
}

func (s *nabuGrpcService) Build(req *pb.BuildRequest, resp pb.NabuService_BuildServer) error {
	repo, err := s.store.Project(req.ProjectId)
	if err != nil {
		return err
	}

	messages, err := s.builder.Build(repo.Repository.Token, repo.Repository.Owner, repo.Repository.Name, "master", req.Sha)
	defer close(messages)

	for message := range messages {
		resp.Send(&pb.BuildResponse{
			Message: &pb.Message{
				Id:      message.Id,
				Message: message.Text,
				Status:  convertStatus(message.Status),
			},
		})
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
