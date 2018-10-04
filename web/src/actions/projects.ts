import { Action } from 'redux';
import {
  AuthRequest,
  AuthResponse,
  Branch,
  BranchRequest,
  BuildRequest,
  Commit,
  CommitsRequest,
  CopyRequest,
  EmptyRequest,
  Error,
  InstallRequest,
  ListBranchesResponse,
  ListCommitsResponse,
  ListProjectsResponse,
  Message,
  MessageResponse,
  Project,
  RestartRequest,
  User
} from '../protobuf/nabu_pb';
import { GrpcAction, grpcRequest } from '../middleware/grpc';
import { grpc } from 'grpc-web-client';
import { NabuService } from '../protobuf/nabu_pb_service';
import history from '../history';

export const PROJECTS_INIT = 'PROJECTS_INIT';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_PROJECT = 'ADD_PROJECT';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const SELECT_BRANCH = 'SELECT_BRANCH';
export const ADD_BRANCH = 'ADD_BRANCH';
export const ADD_COMMIT = 'ADD_COMMIT';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const ADD_ERROR = 'ADD_ERROR';

const host = 'http://localhost:9091';

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
    host: host,
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
  payload: {
    projectId: number,
    branch: string,
  }
};
export const selectBranch = (projectId: number, branch: string): SelectBranch => {
  return ({ type: SELECT_BRANCH, payload: { projectId: projectId, branch: branch } });
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
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: host,
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
    host: host,
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
  type: typeof ADD_MESSAGE,
  payload: Message,
};
export const addMessage = (message: Message) => ({ type: ADD_MESSAGE, payload: message });

export const buildProject = (projectId: number, branch: string, sha: string) => {

  let req = new BuildRequest();
  req.setProjectId(projectId);
  req.setBranch(branch);
  req.setSha(sha);

  return grpcRequest<BuildRequest, MessageResponse>({
    request: req,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: host,
    methodDescriptor: NabuService.Build,
    onMessage: message => {
      const m = message.getMessage();
      if (m) {
        return addMessage(m);
      }
      return;
    }
  });
};

export const copyProject = (projectId: number, sha: string) => {

  let req = new CopyRequest();
  req.setProjectId(projectId);
  req.setSha(sha);

  return grpcRequest<CopyRequest, MessageResponse>({
    request: req,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: host,
    methodDescriptor: NabuService.Copy,
    onMessage: message => {
      const m = message.getMessage();
      if (m) {
        return addMessage(m);
      }
      return;
    }
  });
};

export const installProject = (projectId: number, sha: string, color: string) => {

  let req = new InstallRequest();
  req.setProjectId(projectId);
  req.setColor(color);
  req.setSha(sha);

  return grpcRequest<InstallRequest, MessageResponse>({
    request: req,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: host,
    methodDescriptor: NabuService.Install,
    onMessage: message => {
      const m = message.getMessage();
      if (m) {
        return addMessage(m);
      }
      return;
    }
  });
};

export const restartProject = (projectId: number, sha: string, color: string) => {

  let req = new RestartRequest();
  req.setProjectId(projectId);
  req.setColor(color);
  req.setSha(sha);

  return grpcRequest<InstallRequest, MessageResponse>({
    request: req,
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
    },
    host: host,
    methodDescriptor: NabuService.Restart,
    onMessage: message => {
      const m = message.getMessage();
      if (m) {
        return addMessage(m);
      }
      return;
    }
  });
};

type SignOut = {
  type: typeof SIGN_OUT,
};
export const signOut = (): SignOut => {
  localStorage.clear();
  return ({ type: SIGN_OUT });
};

type SignIn = {
  type: typeof SIGN_IN,
  payload: User.AsObject,
};
export const signIn = (user: User.AsObject | null) => {
  if (user && user.id && user.token) {
    localStorage.setItem('user', JSON.stringify(user));
    history.push('/projects');
    return ({ type: SIGN_IN, payload: user });
  }

  let err = new Error();
  err.setText('Wrong username or password');

  return ({ type: ADD_ERROR, payload: [err] });
};

type AddError = {
  type: typeof ADD_ERROR,
  payload: Array<Error.AsObject> | null,
};

export const addErrors = (errors: Array<Error.AsObject>) => {
  return ({ type: ADD_ERROR, payload: errors });
};

export const authenticate = (username: string, password: string) => {
  let req = new AuthRequest();
  req.setUsername(username);
  req.setPassword(password);

  return grpcRequest<AuthRequest, AuthResponse>({
    request: req,
    onStart: () => signOut(),
    onEnd: (code: grpc.Code, message: string | undefined, trailers: grpc.Metadata): Action | void => {
      console.log(code, message, trailers);
      return;
    },
    host: host,
    methodDescriptor: NabuService.Authenticate,
    onMessage: message => {
      const errors = message.getErrorsList();

      if (errors && errors.length) {
        let unwrapped = errors.map(e => e.toObject())
        return addErrors(unwrapped);
      }
      const user = message.getUser();
      if (user) {
        return signIn(user.toObject());
      }

      return signIn(null);
    },
  });
};

export type ProjectActionTypes =
  | AddProject
  | SignIn
  | SignOut
  | ListProjectsInit
  | SelectProject
  | AddBranch
  | AddCommit
  | ClearMessages
  | SelectBranch
  | AddBuildMessages
  | AddError
  | Request
  | GrpcAction<EmptyRequest, ListProjectsResponse>
  | GrpcAction<BranchRequest, ListBranchesResponse>
  | GrpcAction<CommitsRequest, ListCommitsResponse>
  | GrpcAction<BuildRequest, MessageResponse>
  | GrpcAction<InstallRequest, MessageResponse>
  | GrpcAction<AuthRequest, AuthResponse>
  | GrpcAction<CopyRequest, MessageResponse>;
