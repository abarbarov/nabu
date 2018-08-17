import { Action } from 'redux';
import { ListStoriesRequest, ListStoriesResponse, Story } from '../protobuf/nabu_pb';
import { GrpcAction, grpcRequest } from '../middleware/grpc';
import { grpc } from 'grpc-web-client';
import { NabuService } from '../protobuf/nabu_pb_service';

export const PROJECTS_INIT = 'PROJECTS_INIT';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SELECT_PROJECT = 'SELECT_PROJECT';

type AddProject = {
  type: typeof ADD_PROJECT,
  payload: Story,
};
export const addProject = (story: Story) => ({ type: ADD_PROJECT, payload: story });

type ListProjectsInit = {
  type: typeof PROJECTS_INIT,
};
export const listProjectsInit = (): ListProjectsInit => ({type: PROJECTS_INIT});

export const listProjects = () => {

  return grpcRequest<ListStoriesRequest, ListStoriesResponse>({
    request: new ListStoriesRequest(),
    onStart: () => listProjectsInit(),
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
      return;
    },
    host: 'http://localhost:9091',
    methodDescriptor: NabuService.ListStories,
    onMessage: message => {
      const story = message.getStory();
      if (story) {
        return addProject(story);
      }
      return;
    },
  });
};

type SelectStory = {
  type: typeof SELECT_PROJECT,
  payload: number,
};
export const selectStory = (storyId: number): SelectStory => ({ type: SELECT_PROJECT, payload: storyId });

export type StoryActionTypes =
  | ListProjectsInit
  | AddProject
  | SelectStory
  | GrpcAction<ListStoriesRequest, ListStoriesResponse>;
