import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import ProjectList from './List/ProjectList';
import CommitsView from './View/CommitsView';
import BranchesList from './List/BranchesList';
import { RootAction } from '../../actions';
import {
  buildProject,
  clearMessages,
  copyProject,
  listBranches,
  listCommits,
  listProjects,
  selectBranch,
  selectProject
} from '../../actions/projects';
import { Branch, Commit, Message, Project } from '../../protobuf/nabu_pb';
import Logs from '../Log/Log';

type ProjectsProps = {
  projects: Project.AsObject[],
  commits: Commit.AsObject[],
  branches: Branch.AsObject[],
  messages: Message.AsObject[],
  loading: boolean,
  error: Error | null,
  selectedProject: Project.AsObject | null,
  selectedBranch: Branch.AsObject | null,
  selectedCommit: Commit.AsObject | null,
  fetchProjects: () => void,
  selectProject: (id: number) => void,
  selectBranch: (projectId: number, name: string) => void,
  build: (projectId: number, branch: string, sha: string) => void,
  copy: (projectId: number, sha: string) => void,
};

class Projects extends React.Component<ProjectsProps, {}> {

  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    return (
      <div>
        <div>Next Awesome Build Unit</div>

        <div>
          Projects available
        </div>
        <div>
          <button>Add new</button>
        </div>
        <hr/>
        <div>
          <ProjectList
            selectedProject={this.props.selectedProject}
            projects={this.props.projects}
            onProjectSelect={this.props.selectProject}
          />

          <div>
            {this.props.selectedProject
              ? <BranchesList
                branches={this.props.branches}
                selectedProject={this.props.selectedProject}
                selectedBranch={this.props.selectedBranch}
                onBranchSelect={this.props.selectBranch}
              />
              : null
            }
          </div>
          <hr/>

          <div>
            {this.props.selectedBranch && this.props.selectedProject
              ? <CommitsView
                selectedProject={this.props.selectedProject}
                selectedBranch={this.props.selectedBranch}
                commits={this.props.commits}
                selectedCommit={this.props.selectedCommit}
                onBuild={this.props.build}
                onCopy={this.props.copy}
              />
              : null
            }
          </div>
          <Logs messages={this.props.messages}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    projects: Object.keys(state.projects.projects).map(key => state.projects.projects[parseInt(key, 10)]),
    commits: Object.keys(state.projects.commits).map(key => state.projects.commits[key]),
    branches: Object.keys(state.projects.branches).map(key => state.projects.branches[key]),
    messages: Object.keys(state.projects.messages).map(key => state.projects.messages[parseInt(key, 10)]),
    loading: state.projects.loading,
    error: state.projects.error,
    selectedProject: state.projects.selectedProject,
    selectedCommit: state.projects.selectedCommit,
    selectedBranch: state.projects.selectedBranch,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    fetchProjects: () => {
      dispatch(listProjects());
    },
    selectProject: (projectId: number) => {
      dispatch(selectProject(projectId));
      dispatch(listBranches(projectId));
    },
    selectBranch: (projectId: number, name: string) => {
      dispatch(selectBranch(projectId, name));
      dispatch(listCommits(projectId, name));
    },
    build: (projectId: number, branch: string, sha: string) => {
      dispatch(clearMessages());
      dispatch(buildProject(projectId, branch, sha));
    },
    copy: (projectId: number, sha: string) => {
      dispatch(clearMessages());
      dispatch(copyProject(projectId, sha));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
