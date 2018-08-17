package grpc

import (
	pb "github.com/abarbarov/nabu/protobuf"
	"net/http"
)

type hackerNewsService struct {
	api *hackerNewsApi
}

func NewHackerNewsService(api *hackerNewsApi) *hackerNewsService {
	if api == nil {
		api = NewHackerNewsApi(nil)
	}
	return &hackerNewsService{api}
}

func (s *hackerNewsService) ListStories(req *pb.ListStoriesRequest, resp pb.NabuService_ListStoriesServer) error {
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

type Item struct {
	Id    int32  `json:id`
	Score int32  `json:score`
	Title string `json:title`
	By    string `json:by`
	Time  int32  `json:time`
	Url   string `json:url`
	Type  string `json:type`
}

type hackerNewsApi struct {
}

type ItemResult struct {
	Item  *pb.Story
	Error error
}

func NewHackerNewsApi(client *http.Client) *hackerNewsApi {
	return &hackerNewsApi{}
}

func (api *hackerNewsApi) GetStory(id int32) (*pb.Story, error) {
	return &pb.Story{
		Id:    id,
		By:    "test by",
		Score: 1,
		Time:  1121231231,
		Title: "test",
		Url:   "https://nabu.app",
	}, nil
}

func (api *hackerNewsApi) TopStories() (chan *pb.Story, error) {
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

//
//import (
//	pb "github.com/abarbarov/nabu/protobuf"
//	//"net/http"
//)
//
//type NabuGrpcService struct {
//	github *githubApi
//	tfapi  *terraformApi
//}
//
//type githubApi struct {
//}
//
//type terraformApi struct{
//}
//
//type Item struct {
//	Id    int32  `json:id`
//	Score int32  `json:score`
//	Title string `json:title`
//	By    string `json:by`
//	Time  int32  `json:time`
//	Url   string `json:url`
//	Type  string `json:type`
//}
//
//type ItemResult struct {
//	Item  *pb.Story
//	Error error
//}
//
//func (api *githubApi) GetStory(id int32) (*pb.Story, error) {
//	return &pb.Story{
//		Id:    id,
//		By:    "test by",
//		Score: 1,
//		Time:  1121231231,
//		Title: "test",
//		Url:   "nabu.app",
//	}, nil
//}
//
//func (api *githubApi) TopStories() (chan *pb.Story, error) {
//	stories := make(chan *pb.Story)
//
//	ids := []int32{0, 1, 2}
//	for _, id := range ids {
//		go func(id int32) {
//			story, _ := api.GetStory(id)
//			stories <- story
//		}(id)
//	}
//
//	return stories, nil
//}
//
//func (s *NabuGrpcService) ListStories(req *pb.ListStoriesRequest, resp pb.NabuService_ListStoriesServer) error {
//	stories, err := s.github.TopStories()
//	defer close(stories)
//	if err != nil {
//		return err
//	}
//	for story := range stories {
//		resp.Send(&pb.ListStoriesResponse{
//			Story: story,
//		})
//	}
//
//	return nil
//}
