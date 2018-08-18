import {RootAction} from '../actions';
import {ADD_COMMIT, ADD_PROJECT, PROJECTS_INIT, SELECT_PROJECT} from '../actions/projects';
import {Commit, Project} from '../protobuf/nabu_pb';

export type ProjectState = {
  readonly projects: { [projectId: number]: Project.AsObject },
  readonly commits: { [commitId: string]: Commit.AsObject },
  readonly error: Error | null,
  readonly loading: boolean,
  readonly selectedProject: Project.AsObject | null,
  readonly selectedCommit: Commit.AsObject | null,
};

const initialState = {
  projects: {},
  commits: {},
  error: null,
  loading: false,
  selectedProject: null,
  selectedCommit: null,
};

export default function (state: ProjectState = initialState, action: RootAction): ProjectState {
  switch (action.type) {

    case PROJECTS_INIT:
      return {...state, loading: true};

    case SELECT_PROJECT:
      return {...state, loading: true, selectedProject: state.projects[action.payload]};

    case ADD_PROJECT:
      const project: Project.AsObject = action.payload.toObject();
      if (project.id) {
        return {
          ...state,
          loading: false,
          projects: {...state.projects, [project.id]: project},
        };
      }
      return state;

    case ADD_COMMIT:
      const commit: Commit.AsObject = action.payload.toObject();
      if (commit && commit.sha) {
        return {
          ...state,
          loading: false,
          commits: {...state.commits, [commit.sha]: commit},
        };
      }
      return state;

    default:
      return state;
  }
}
