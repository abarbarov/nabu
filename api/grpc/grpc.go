package grpc

import (
	"fmt"
	pb "github.com/abarbarov/nabu/protobuf"
	"golang.org/x/net/context"
)

type nabuGrpcService struct {
	github *githubApi
	tfapi  *terraformApi
	store  *storeApi
}

type Item struct {
	Id    int32  `json:id`
	Score int32  `json:score`
	Title string `json:title`
	By    string `json:by`
	Time  int32  `json:time`
	Url   string `json:url`
	Type  string `json:type`
}

type githubApi struct {
}

type terraformApi struct {
}

type storeApi struct {
}

type ItemResult struct {
	Item  *pb.Project
	Error error
}

func NewNabuGrpcService() *nabuGrpcService {
	github := &githubApi{}
	terraform := &terraformApi{}
	store := &storeApi{}

	return &nabuGrpcService{github, terraform, store}
}

func (s *nabuGrpcService) ListProjects(req *pb.EmptyRequest, resp pb.NabuService_ListProjectsServer) error {
	stories, err := s.github.Projects()
	defer close(stories)
	if err != nil {
		return err
	}
	for story := range stories {
		resp.Send(&pb.ListProjectsResponse{
			Project: story,
		})
	}

	return nil
}
func (s *nabuGrpcService) ListCommits(req *pb.RepositoryRequest, resp pb.NabuService_ListCommitsServer) error {
	stories, err := s.github.Commits()
	defer close(stories)
	if err != nil {
		return err
	}
	for story := range stories {
		resp.Send(&pb.ListCommitsResponse{
			Commit: story,
		})
	}

	return nil
}

func (s *nabuGrpcService) CreateProject(ctx context.Context, req *pb.CreateProjectRequest) (*pb.ListProjectsResponse, error) {
	return &pb.ListProjectsResponse{}, nil
}

func (api *githubApi) GetProject(id int64) (*pb.Project, error) {
	return &pb.Project{
		Id: id,
	}, nil
}

func (api *githubApi) GetCommit(id int64) (*pb.Commit, error) {
	return &pb.Commit{
		Sha: fmt.Sprintf("%d", id),
	}, nil
}

func (api *githubApi) Projects() (chan *pb.Project, error) {
	stories := make(chan *pb.Project)

	ids := []int64{1, 2, 3, 4, 5, 6}
	for _, id := range ids {
		go func(id int64) {
			story, _ := api.GetProject(id)
			stories <- story
		}(id)
	}

	return stories, nil
}

func (api *githubApi) Commits() (chan *pb.Commit, error) {
	stories := make(chan *pb.Commit)

	ids := []int64{0, 1, 2}
	for _, id := range ids {
		go func(id int64) {
			story, _ := api.GetCommit(id)
			stories <- story
		}(id)
	}

	return stories, nil
}
