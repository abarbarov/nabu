package grpc

import (
	"fmt"
	pb "github.com/abarbarov/nabu/protobuf"
	"github.com/abarbarov/nabu/store"
	"golang.org/x/net/context"
	"log"
)

type nabuGrpcService struct {
	github    *githubApi
	terraform *terraformApi
	store     *store.DataStore
}

type githubApi struct {
}

type terraformApi struct {
}

func NewNabuGrpcService(s *store.DataStore) *nabuGrpcService {
	github := &githubApi{}
	terraform := &terraformApi{}
	store := s

	return &nabuGrpcService{github, terraform, store}
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
				Repository: p.Repository.Title,
			}

			output <- project
		}(p)
	}

	return output, nil
}

func (s *nabuGrpcService) ListCommits(req *pb.ProjectRequest, resp pb.NabuService_ListCommitsServer) error {
	repo := s.store.Project(req.Id)
	log.Printf("%v", repo)

	commits, err := s.Commits(req.Owner, req.Name, req.Branch)
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

func (s *nabuGrpcService) GetCommit(id int64) (*pb.Commit, error) {
	return &pb.Commit{
		Sha: fmt.Sprintf("%d", id),
	}, nil
}

func (s *nabuGrpcService) Commits(owner, name, branch string) (chan *pb.Commit, error) {
	commits := make(chan *pb.Commit)

	s.github.Commits(owner, name, branch)
	for _, id := range ids {
		go func(id int64) {
			commit, _ := s.GetCommit(id)
			commits <- commit
		}(id)
	}

	return commits, nil
}
