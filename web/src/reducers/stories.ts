import { RootAction } from '../actions';
import { ADD_PROJECT, SELECT_PROJECT, PROJECTS_INIT } from '../actions/stories';
import { Story } from '../protobuf/nabu_pb';

export type StoryState = {
  readonly stories: { [storyId: number]: Story.AsObject },
  readonly error: Error | null,
  readonly loading: boolean,
  readonly selected: Story.AsObject | null,
};

const initialState = {
  stories: {},
  error: null,
  loading: false,
  selected: null,
};

export default function (state: StoryState = initialState, action: RootAction): StoryState {

  switch (action.type) {

    case PROJECTS_INIT:
      return {...state, loading: true};

    case ADD_PROJECT:
      const story: Story.AsObject = action.payload.toObject();
      const selected = state.selected !== null ? state.selected : story;
      if (story.id) {
        return {
          ...state,
          loading: false,
          stories: {...state.stories, [story.id]: story},
          selected,
        };
      }
      return state;

    case SELECT_PROJECT:
      return {...state, selected: state.stories[action.payload]};

    default:
      return state;
  }

}
