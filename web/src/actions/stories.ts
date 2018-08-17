import { Action } from 'redux';
import { EmptyRequest, ListProjectsResponse, Project } from '../protobuf/nabu_pb';
import { GrpcAction, grpcRequest } from '../middleware/grpc';
import { grpc } from 'grpc-web-client';
import { NabuService } from '../protobuf/nabu_pb_service';

export const PROJECTS_INIT = 'PROJECTS_INIT';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SELECT_PROJECT = 'SELECT_PROJECT';

type AddProject = {
  type: typeof ADD_PROJECT,
  payload: Project,
};
export const addProject = (story: Project) => ({ type: ADD_PROJECT, payload: story });

type ListProjectsInit = {
  type: typeof PROJECTS_INIT,
};
export const listProjectsInit = (): ListProjectsInit => ({type: PROJECTS_INIT});

export const listProjects = () => {

  return grpcRequest<EmptyRequest, ListProjectsResponse>({
    request: new EmptyRequest(),
    onStart: () => listProjectsInit(),
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
      return;
    },
    host: 'http://localhost:9091',
    methodDescriptor: NabuService.ListProjects,
    onMessage: message => {
      const story = message.getProject();
      if (story) {
        return addProject(story);
      }
      return;
    },
  });
};

type SelectProject = {
  type: typeof SELECT_PROJECT,
  payload: number,
};
export const selectProject = (storyId: number): SelectProject => ({ type: SELECT_PROJECT, payload: storyId });

export type StoryActionTypes =
  | ListProjectsInit
  | AddProject
  | SelectProject
  | GrpcAction<EmptyRequest, ListProjectsResponse>;
