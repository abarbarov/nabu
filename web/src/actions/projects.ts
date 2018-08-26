import { Action } from 'redux';
import {
  Branch,
  BranchRequest,
  BuildRequest,
  BuildResponse,
  Commit,
  CommitsRequest,
  EmptyRequest,
  ListBranchesResponse,
  ListCommitsResponse,
  ListProjectsResponse,
  Message,
  Project
} from '../protobuf/nabu_pb';
import { GrpcAction, grpcRequest } from '../middleware/grpc';
import { grpc } from 'grpc-web-client';
import { NabuService } from '../protobuf/nabu_pb_service';

export const PROJECTS_INIT = 'PROJECTS_INIT';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const ADD_COMMIT = 'ADD_COMMIT';
export const ADD_BUILD_MESSAGE = 'ADD_BUILD_MESSAGE';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const SELECT_BRANCH = 'SELECT_BRANCH';
export const ADD_BRANCH = 'ADD_BRANCH';

type ListProjectsInit = {
  type: typeof PROJECTS_INIT,
};
export const listProjectsInit = (): ListProjectsInit => ({ type: PROJECTS_INIT });

type AddProject = {
  type: typeof ADD_PROJECT,
  payload: Project,
};
export const addProject = (story: Project) => ({ type: ADD_PROJECT, payload: story });

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
      const project = message.getProject();
      if (project) {
        return addProject(project);
      }
      return;
    },
  });
};

type SelectProject = {
  type: typeof SELECT_PROJECT,
  payload: number,
};
export const selectProject = (projectId: number): SelectProject => {
  return ({ type: SELECT_PROJECT, payload: projectId });
};

type SelectBranch = {
  type: typeof SELECT_BRANCH,
  payload: string

};
export const selectBranch = (branch: string): SelectBranch => {
  return ({ type: SELECT_BRANCH, payload: branch });
};

type AddBranch = {
  type: typeof ADD_BRANCH,
  payload: Branch
};
export const addBranch = (branch: Branch) => ({ type: ADD_BRANCH, payload: branch });

type AddCommit = {
  type: typeof ADD_COMMIT,
  payload: Commit,
};
export const addCommit = (commit: Commit) => ({ type: ADD_COMMIT, payload: commit });

export const listCommits = (projectId: number, branch: string) => {

  let request = new CommitsRequest();
  request.setBranchName(branch);
  request.setRepoId(projectId);

  return grpcRequest<CommitsRequest, ListCommitsResponse>({
    request: request,
    // onStart: () => selectProject(projectId),
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: 'http://localhost:9091',
    methodDescriptor: NabuService.ListCommits,
    onMessage: message => {
      const commit = message.getCommit();
      if (commit) {
        return addCommit(commit);
      }
      return;
    }
  });
};

export const listBranches = (projectId: number) => {

  let branchRequest = new BranchRequest();
  branchRequest.setRepoId(projectId);

  return grpcRequest<BranchRequest, ListBranchesResponse>({
    request: branchRequest,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: 'http://localhost:9091',
    methodDescriptor: NabuService.ListBranches,
    onMessage: message => {
      const b = message.getBranch();
      if (b) {
        return addBranch(b);
      }
      return;
    }
  });
};

type ClearMessages = {
  type: typeof CLEAR_MESSAGES,
};
export const clearMessages = (): ClearMessages => ({ type: CLEAR_MESSAGES });

type AddBuildMessages = {
  type: typeof ADD_BUILD_MESSAGE,
  payload: Message,
};
export const addBuildMessage = (message: Message) => ({ type: ADD_BUILD_MESSAGE, payload: message });

export const buildProject = (projectId: number, sha: string) => {

  let buildRequest = new BuildRequest();
  buildRequest.setProjectId(projectId);
  buildRequest.setSha(sha);

  return grpcRequest<BuildRequest, BuildResponse>({
    request: buildRequest,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: 'http://localhost:9091',
    methodDescriptor: NabuService.Build,
    // transport: grpc.WebsocketTransportFactory,
    onMessage: message => {
      const m = message.getMessage();
      if (m) {
        return addBuildMessage(m);
      }
      return;
    }
  });
};

export type ProjectActionTypes =
  | AddProject
  | ListProjectsInit
  | SelectProject
  | AddBranch
  | AddCommit
  | ClearMessages
  | SelectBranch
  | AddBuildMessages
  | GrpcAction<EmptyRequest, ListProjectsResponse>
  | GrpcAction<BranchRequest, ListBranchesResponse>
  | GrpcAction<CommitsRequest, ListCommitsResponse>
  | GrpcAction<BuildRequest, BuildResponse>;
