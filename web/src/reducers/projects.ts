import { RootAction } from '../actions';
import {
  ADD_BRANCH,
  ADD_COMMIT,
  ADD_ERROR,
  ADD_MESSAGE,
  ADD_PROJECT,
  CLEAR_MESSAGES,
  PROJECTS_INIT,
  SELECT_BRANCH,
  SELECT_PROJECT,
  SIGN_IN,
  SIGN_OUT
} from '../actions/projects';

import { Branch, Commit, Message, Project, StatusType, User, Error } from '../protobuf/nabu_pb';

export type ProjectState = {
  readonly projects: { [projectId: number]: Project.AsObject },
  readonly commits: { [commitId: string]: Commit.AsObject },
  readonly branches: { [brancName: string]: Branch.AsObject }
  readonly errors: Array<Error.AsObject> | null,
  readonly loading: boolean,
  readonly selectedProject: Project.AsObject | null,
  readonly selectedBranch: Branch.AsObject | null,
  readonly selectedCommit: Commit.AsObject | null,
  readonly messages: Message.AsObject[],
  readonly user: User.AsObject | null,
  readonly authenticated: boolean,
};

const initialState = {
  projects: {},
  commits: {},
  branches: {},
  messages: [],
  errors: null,
  loading: false,
  selectedProject: null,
  selectedCommit: null,
  selectedBranch: null,
  user: null,
  authenticated: false
};

export default function (state: ProjectState = initialState, action: RootAction): ProjectState {
  console.log(action.type);

  switch (action.type) {

    case PROJECTS_INIT:
      return { ...state, loading: true };

    case SELECT_PROJECT:
      return {
        ...state,
        loading: true,
        commits: {},
        branches: {},
        messages: [],
        selectedProject: state.projects[action.payload],
        selectedBranch: null
      };

    case SELECT_BRANCH:
      return {
        ...state,
        loading: true,
        messages: [],
        commits: {},
        selectedBranch: state.branches[action.payload.branch]
      };

    case CLEAR_MESSAGES:
      return { ...state, loading: true, messages: [] };

    case ADD_PROJECT:
      const project: Project.AsObject = action.payload.toObject();
      if (project.id) {
        return {
          ...state,
          loading: false,
          projects: { ...state.projects, [project.id]: project },
        };
      }
      return state;

    case ADD_BRANCH:
      const branch: Branch.AsObject = action.payload.toObject();
      if (branch && branch.name) {
        return {
          ...state,
          loading: false,
          branches: { ...state.branches, [branch.name]: branch },
        };
      }
      return state;

    case ADD_COMMIT:
      const commit: Commit.AsObject = action.payload.toObject();
      if (commit && commit.sha) {
        return {
          ...state,
          loading: false,
          commits: { ...state.commits, [commit.sha]: commit },
        };
      }
      return state;

    case ADD_MESSAGE:
      const m: Message.AsObject = action.payload.toObject();
      if (m && m.message) {
        // console.log(m);

        if (m.status === StatusType.PENDING) {
          if (state.messages[m.id]) {
            m.message += state.messages[m.id].message;
          }
        }

        return {
          ...state,
          loading: false,
          messages: Object.assign([...state.messages], { [m.id]: m })
        };
      }
      return state;

    case SIGN_IN:
      return { ...state, authenticated: true, user: action.payload };

    case SIGN_OUT:
      return { ...state, authenticated: false, user: null };

    case ADD_ERROR:
      return { ...state, errors: action.payload };

    default:
      return state;
  }
}
