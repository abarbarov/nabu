import { RootAction } from '../actions';
import { ADD_PROJECT, PROJECTS_INIT, SELECT_PROJECT } from '../actions/projects';
import { Commit, Project } from '../protobuf/nabu_pb';

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
      return { ...state, loading: true };

    case ADD_PROJECT:
      const project: Project.AsObject = action.payload.toObject();
      const selectedProject = state.selectedProject !== null ? state.selectedProject : project;
      if (project.id) {
        return {
          ...state,
          loading: false,
          projects: { ...state.projects, [project.id]: project },
          selectedProject,
        };
      }
      return state;

    case SELECT_PROJECT:
      return { ...state, selectedProject: state.projects[action.payload] };

    default:
      return state;
  }

}
