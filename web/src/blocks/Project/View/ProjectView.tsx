import * as React from 'react';
import { Commit, Project } from '../../../protobuf/nabu_pb';

type ProjectViewProps = {
  selectedProject: Project.AsObject,
  selectedCommit: Commit.AsObject | null,
  commits: Commit.AsObject[],
  onBuild: (projectid: number, sha: string) => void
};

const ProjectView: React.SFC<ProjectViewProps> = (props) => {
  return (
    <div style={{ border: '1px solid red' }}>

      <h5>Commits available</h5>

      {props.commits.map((commit, i) =>
        <div
          style={props.selectedCommit && commit.sha === props.selectedCommit.sha ?
            { 'backgroundColor': 'rgba(0, 0, 0, 0.08)' } : {}}
          key={i}
        >
          <div style={{ display: 'flex' }}>
            <div>[{commit.timestamp || 'timestamp'}]|</div>
            <div>{commit.sha} |</div>
            <div>{commit.message}</div>
            <button type="button" onClick={() => props.onBuild(props.selectedProject.id, commit.sha)}>Build</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
