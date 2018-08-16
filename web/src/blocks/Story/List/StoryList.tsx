import * as React from 'react';
import { Story } from '../../../proto/nabu_pb';

type StoryListProps = {
  stories: Story.AsObject[],
  selected: Story.AsObject | null,
  onStorySelect: (id: number) => void
};

const StoryList: React.SFC<StoryListProps> = (props) => {
  return (
    <div>
      {props.stories.map((story, i) =>
        <div style={props.selected && story.id === props.selected.id
            ? {'backgroundColor': 'rgba(0, 0, 0, 0.08)'}
            : {}
          }
          key={i}
          onClick={() => {
            if (story.id) {
              props.onStorySelect(story.id);
            }
          }}>
          <div>
            <div>{story.title}</div>
            <div>{story.score} | {story.by}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryList;
