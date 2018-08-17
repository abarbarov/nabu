import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import StoryList from './List/StoryList';
import StoryView from './View/StoryView';
import { RootAction } from '../../actions';
import { listStories, selectStory } from '../../actions/stories';
import { Story } from '../../protobuf/nabu_pb';

type StoriesProps = {
  stories: Story.AsObject[],
  loading: boolean,
  error: Error | null,
  selected: Story.AsObject | null,

  fetchStories: () => void,
  selectStory: (id: number) => void,
};

class Stories extends React.Component<StoriesProps, {}> {

  componentDidMount() {
    this.props.fetchStories();
  }

  render() {
    return (
      <div>
        <div>Next Awesome Build Unit</div>

        <div>
          <div>
            <StoryList
              selected={this.props.selected}
              stories={this.props.stories}
              onStorySelect={this.props.selectStory}
            />
          </div>

          <div>
            { this.props.selected
              ? <StoryView story={this.props.selected} />
              : null
            }
          </div>
        </div>

      </div>
    );
  }

}

function mapStateToProps(state: RootState) {
  return {
    stories: Object.keys(state.stories.stories).map(key => state.stories.stories[parseInt(key, 10)]),
    loading: state.stories.loading,
    error: state.stories.error,
    selected: state.stories.selected,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    fetchStories: () => {
      dispatch(listStories());
    },
    selectStory: (storyId: number) => {
      dispatch(selectStory(storyId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
