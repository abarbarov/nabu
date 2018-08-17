package grpc

import (
	pb "github.com/abarbarov/nabu/protobuf"
	"net/http"
)

type nabuGrpcService struct {
	api   *githubApi
	tfapi *terraformApi
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
type ItemResult struct {
	Item  *pb.Story
	Error error
}

func NewNabuGrpcService() *nabuGrpcService {
	api := NewNabuApi(nil)
	tfApi := &terraformApi{}

	return &nabuGrpcService{api, tfApi}
}

func NewNabuApi(client *http.Client) *githubApi {
	return &githubApi{}
}

func (s *nabuGrpcService) ListStories(req *pb.ListStoriesRequest, resp pb.NabuService_ListStoriesServer) error {
	stories, err := s.api.TopStories()
	defer close(stories)
	if err != nil {
		return err
	}
	for story := range stories {
		resp.Send(&pb.ListStoriesResponse{
			Story: story,
		})
	}

	return nil
}

func (api *githubApi) GetStory(id int32) (*pb.Story, error) {
	return &pb.Story{
		Id:    id,
		By:    "test by",
		Score: 1,
		Time:  1121231231,
		Title: "test",
		Url:   "https://nabu.app",
	}, nil
}

func (api *githubApi) TopStories() (chan *pb.Story, error) {
	stories := make(chan *pb.Story)

	ids := []int32{0, 1, 2}
	for _, id := range ids {
		go func(id int32) {
			story, _ := api.GetStory(id)
			stories <- story
		}(id)
	}

	return stories, nil
}
