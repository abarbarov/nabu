package grpc

import (
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
}

type terraformApi struct {
}

func NewNabuGrpcService(s *store.DataStore, g *github.Github) *nabuGrpcService {
	github := g
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
			//commit, _ := s.GetCommit(id)
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
