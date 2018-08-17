import * as React from 'react';
import { Project } from '../../../protobuf/nabu_pb';

type ProjectViewProps = {
  project: Project.AsObject,
};

const ProjectView: React.SFC<ProjectViewProps> = (props) => {
  const url = `http://localhost:9091/grpc-project-proxy?q=${encodeURIComponent(`${props.project.id}`)}`;
  return (
    <div>
      <iframe
        frameBorder="0"
        style={{
          height: '100vh',
          width: '100%',
        }}
        src={url}
      />
    </div>
  );
};

export default ProjectView;
