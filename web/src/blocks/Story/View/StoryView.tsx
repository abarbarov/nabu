import * as React from 'react';
import { Project } from '../../../protobuf/nabu_pb';

type StoryViewProps = {
  story: Project.AsObject,
};

const StoryView: React.SFC<StoryViewProps> = (props) => {
  const url = `http://localhost:9091/grpc-article-proxy?q=${encodeURIComponent(`${props.story.id}`)}`;
  return (
    <iframe
      frameBorder="0"
      style={{
        height: '100vh',
        width: '100%',
      }}
      src={url}
    />
  );
};

export default StoryView;
