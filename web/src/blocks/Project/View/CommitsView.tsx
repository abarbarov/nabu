import * as React from 'react';
import { Branch, Commit, Project } from '../../../protobuf/nabu_pb';

type ProjectViewProps = {
  selectedProject: Project.AsObject,
  selectedBranch: Branch.AsObject,
  selectedCommit: Commit.AsObject | null,
  commits: Commit.AsObject[],
  onBuild: (projectid: number, branch: string, sha: string) => void
  onCopy: (projectid: number, sha: string) => void
  onInstall: (projectid: number, sha: string, color: string) => void
};

const CommitsView: React.SFC<ProjectViewProps> = (props) => {
  function getDate(c: Commit.AsObject | undefined) {
    if (c && c.timestamp) {
      return new Date(c.timestamp.seconds * 1000).toISOString();
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
          className="commits_item"
          style={props.selectedCommit && commit.sha === props.selectedCommit.sha ?
            { 'backgroundColor': 'rgba(0, 0, 0, 0.08)' } : {}}
          key={i}
        >
          <div>[{getDate(commit)}]</div>
          <div>| {commit.sha}</div>
          <div>| {commit.message}</div>
          <div>
            <button
              type="button"
              onClick={() => props.onBuild(props.selectedProject.id, props.selectedBranch.name, commit.sha)}
            >Build
            </button>
            <button type="button" onClick={() => props.onCopy(props.selectedProject.id, commit.sha)}>Copy</button>
            <button type="button" onClick={() => props.onInstall(props.selectedProject.id, commit.sha, 'blue')}>install
              blue
            </button>
            <button type="button" onClick={() => props.onInstall(props.selectedProject.id, commit.sha, 'green')}>install
              green
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitsView;
