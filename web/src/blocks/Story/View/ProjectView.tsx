import * as React from 'react';
import { Project, Commit } from '../../../protobuf/nabu_pb';

type ProjectViewProps = {
  selectedProject: Project.AsObject,
  selectedCommit: Commit.AsObject | null,
  commits: Commit.AsObject[],
  onCommitSelect: (sha: string) => void
};

const ProjectView: React.SFC<ProjectViewProps> = (props) => {
  return (
    <div style={{border: "1px solid red;"}}>
      <h5>Commits available</h5>
      {props.commits.map((commit, i) =>
        <div style={props.selectedCommit && commit.sha === props.selectedCommit.sha
          ? {'backgroundColor': 'rgba(0, 0, 0, 0.08)'}
          : {}
        }
             key={i}
             onClick={() => {
               if (commit.sha) {
                 props.onCommitSelect(commit.sha);
               }
             }}>
          <div>
            <div>{commit.message}</div>
            <div>{commit.sha} | {commit.sha}</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectView;
