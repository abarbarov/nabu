import * as React from 'react';
import { Project } from '../../../protobuf/nabu_pb';

type StoryListProps = {
  stories: Project.AsObject[],
  selected: Project.AsObject | null,
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
            <div>{story.id} | {story.id}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryList;
