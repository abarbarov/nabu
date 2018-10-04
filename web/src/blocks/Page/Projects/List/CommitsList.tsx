import * as React from 'react';
import { Branch, Commit, Project } from '../../../../protobuf/nabu_pb';
import './CommitsList.css';

type ProjectViewProps = {
  selectedProject: Project.AsObject,
  selectedBranch: Branch.AsObject,
  selectedCommit: Commit.AsObject | null,
  commits: Commit.AsObject[],
  onBuild: (projectid: number, branch: string, sha: string) => void
  onCopy: (projectid: number, sha: string) => void
  onInstall: (projectid: number, sha: string, color: string) => void
  onRestart: (projectid: number, sha: string, color: string) => void
};

const CommitsList: React.SFC<ProjectViewProps> = (props) => {
  function getDate(c: Commit.AsObject | undefined) {
    if (c && c.timestamp) {
      return new Date(c.timestamp.seconds * 1000).toISOString();
    }

    return '';
  }

  return (
    <div className="commits-table">

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
          className={`commits-row ${props.selectedCommit && commit.sha === props.selectedCommit.sha ? 'commits-row_selected' : ''}`}
          key={i}
        >
          <div className="commits-col">[{getDate(commit)}]</div>
          <div className="commits-col">| {commit.sha}</div>
          <div className="commits-col">| {commit.message}</div>
          <div className="commits-col commits-col_actions">
            <button type="button" className="btn btn_color_orange btn_square" onClick={() => props.onBuild(props.selectedProject.id, props.selectedBranch.name, commit.sha)} title="build">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z" />
              </svg>
            </button>
            <button type="button" className="btn btn_color_orange btn_square" onClick={() => props.onCopy(props.selectedProject.id, commit.sha)} title="copy">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
              </svg>
            </button>
            <button type="button" className="btn btn_color_blue btn_square" onClick={() => props.onInstall(props.selectedProject.id, commit.sha, 'blue')} title="install blue">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M15,14V8H17.17L12,2.83L6.83,8H9V14H15M12,0L22,10H17V16H7V10H2L12,0M7,18H17V24H7V18M15,20H9V22H15V20Z" />
              </svg>
            </button>
            <button type="button" className="btn btn_color_green btn_square" onClick={() => props.onInstall(props.selectedProject.id, commit.sha, 'green')} title="install green">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M15,14V8H17.17L12,2.83L6.83,8H9V14H15M12,0L22,10H17V16H7V10H2L12,0M7,18H17V24H7V18M15,20H9V22H15V20Z" />
              </svg>
            </button>
            <button type="button" className="btn btn_color_blue btn_square" onClick={() => props.onRestart(props.selectedProject.id, commit.sha, 'blue')} title="reload blue">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M11,4C13.05,4 15.09,4.77 16.65,6.33C19.78,9.46 19.77,14.5 16.64,17.64C14.81,19.5 12.3,20.24 9.91,19.92L10.44,17.96C12.15,18.12 13.93,17.54 15.24,16.23C17.58,13.89 17.58,10.09 15.24,7.75C14.06,6.57 12.53,6 11,6V10.58L6.04,5.63L11,0.68V4M5.34,17.65C2.7,15 2.3,11 4.11,7.94L5.59,9.41C4.5,11.64 4.91,14.39 6.75,16.23C7.27,16.75 7.87,17.16 8.5,17.45L8,19.4C7,19 6.12,18.43 5.34,17.65Z"/>
              </svg>
            </button>
            <button type="button" className="btn btn_color_green btn_square" onClick={() => props.onRestart(props.selectedProject.id, commit.sha, 'green')} title="reload green">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M11,4C13.05,4 15.09,4.77 16.65,6.33C19.78,9.46 19.77,14.5 16.64,17.64C14.81,19.5 12.3,20.24 9.91,19.92L10.44,17.96C12.15,18.12 13.93,17.54 15.24,16.23C17.58,13.89 17.58,10.09 15.24,7.75C14.06,6.57 12.53,6 11,6V10.58L6.04,5.63L11,0.68V4M5.34,17.65C2.7,15 2.3,11 4.11,7.94L5.59,9.41C4.5,11.64 4.91,14.39 6.75,16.23C7.27,16.75 7.87,17.16 8.5,17.45L8,19.4C7,19 6.12,18.43 5.34,17.65Z"/>
              </svg>
            </button>
            <button title="download backup" className="btn btn_square">
              <svg  className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M19.92,12.08L12,20L4.08,12.08L5.5,10.67L11,16.17V2H13V16.17L18.5,10.66L19.92,12.08M12,20H2V22H22V20H12Z" />
              </svg>
            </button>
            <button title="upload backup" className="btn btn_square">
              <svg className="btn_svg" viewBox="0 0 24 24">
                <path fill="#000000" d="M4.08,11.92L12,4L19.92,11.92L18.5,13.33L13,7.83V22H11V7.83L5.5,13.33L4.08,11.92M12,4H22V2H2V4H12Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitsList;
