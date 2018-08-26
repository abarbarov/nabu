import * as React from 'react';
import { Commit, Project } from '../../../protobuf/nabu_pb';
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

type ProjectViewProps = {
  selectedProject: Project.AsObject,
  selectedCommit: Commit.AsObject | null,
  commits: Commit.AsObject[],
  onBuild: (projectid: number, sha: string) => void
};

const CommitsView: React.SFC<ProjectViewProps> = (props) => {
  function getDate(timestamp: Timestamp.AsObject | undefined) {
    if (timestamp) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }

    return '';
  }

  return (
    <div style={{ border: '1px solid red' }}>

      <h5>Commits available</h5>

      {props.commits.sort((a, b) => {
        if (a && a.timestamp && b && b.timestamp) {
          if (a.timestamp.seconds < b.timestamp.seconds) {
            return 1;
          }
          if (a.timestamp.seconds > b.timestamp.seconds) {
            return -1;
          }
          return 0;
        }
        return 0;
      }).map((commit, i) =>
        <div
          style={props.selectedCommit && commit.sha === props.selectedCommit.sha ?
            { 'backgroundColor': 'rgba(0, 0, 0, 0.08)' } : {}}
          key={i}
        >
          <div style={{ display: 'flex' }}>
            <div>[{getDate(commit.timestamp)}] |</div>
            <div>{commit.sha} |</div>
            <div>{commit.message}</div>
            <button type="button" onClick={() => props.onBuild(props.selectedProject.id, commit.sha)}>Build</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitsView;
