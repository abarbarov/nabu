package hackernews

import (
	pb "github.com/abarbarov/nabu/protobuf"
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
