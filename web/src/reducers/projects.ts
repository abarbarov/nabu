import { RootAction } from '../actions';
import { ADD_PROJECT, SELECT_PROJECT, PROJECTS_INIT } from '../actions/stories';
import { Project } from '../protobuf/nabu_pb';

export type ProjectState = {
  readonly projects: { [storyId: number]: Project.AsObject },
  readonly error: Error | null,
  readonly loading: boolean,
  readonly selected: Project.AsObject | null,
};

const initialState = {
  projects: {},
  error: null,
  loading: false,
  selected: null,
};

export default function (state: ProjectState = initialState, action: RootAction): ProjectState {

  switch (action.type) {

    case PROJECTS_INIT:
      return {...state, loading: true};

    case ADD_PROJECT:
      const story: Project.AsObject = action.payload.toObject();
      const selected = state.selected !== null ? state.selected : story;
      if (story.id) {
        return {
          ...state,
          loading: false,
          projects: {...state.projects, [story.id]: story},
          selected,
        };
      }
      return state;

    case SELECT_PROJECT:
      return {...state, selected: state.projects[action.payload]};

    default:
      return state;
  }

}
