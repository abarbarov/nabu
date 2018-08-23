import { RootAction } from '../actions';
import {
  ADD_BUILD_MESSAGE,
  ADD_COMMIT,
  ADD_PROJECT,
  CLEAR_MESSAGES,
  PROJECTS_INIT,
  SELECT_PROJECT
} from '../actions/projects';
import { Commit, Message, Project, StatusType } from '../protobuf/nabu_pb';

export type ProjectState = {
  readonly projects: { [projectId: number]: Project.AsObject },
  readonly commits: { [commitId: string]: Commit.AsObject },
  readonly error: Error | null,
  readonly loading: boolean,
  readonly selectedProject: Project.AsObject | null,
  readonly selectedCommit: Commit.AsObject | null,
  readonly messages: Message.AsObject[],
};

const initialState = {
  projects: {},
  commits: {},
  messages: [],
  error: null,
  loading: false,
  selectedProject: null,
  selectedCommit: null,
};

export default function (state: ProjectState = initialState, action: RootAction): ProjectState {
  console.log(action.type);

  switch (action.type) {

    case PROJECTS_INIT:
      return { ...state, loading: true };

    case SELECT_PROJECT:
      return { ...state, loading: true, commits: {}, selectedProject: state.projects[action.payload] };

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

    case ADD_BUILD_MESSAGE:
      const m: Message.AsObject = action.payload.toObject();
      if (m && m.message) {
        console.log(m);

        if (m.status == StatusType.PENDING) {
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

    default:
      return state;
  }
}
