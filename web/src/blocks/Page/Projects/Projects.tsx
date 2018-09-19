import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { Dispatch } from 'redux';

import mod1 from '../../Example/_mod1/Example_mod1';
import mod2 from '../../Example/_mod2/Example_mod2';
import Example from '../../Example/Example';
import Header from '../../Header/App-Header';
import Footer from '../../Footer/App-Footer';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store';
import { connect } from 'react-redux';
import { Branch, Commit, Message, Project } from '../../../protobuf/nabu_pb';
import Log from '../../Log/Log';
import { RootAction } from '../../../actions';
import {
  buildProject,
  clearMessages,
  copyProject,
  installProject,
  listBranches,
  listCommits,
  listProjects,
  selectBranch,
  selectProject
} from '../../../actions/projects';
import ProjectList from './List/ProjectList';
import CommitsList from './List/CommitsList';
import BranchesList from './List/BranchesList';
import './Projects.css';

export interface IProjectsProps {
  path: string; // ???
  authenticated: boolean;
  projects: Project.AsObject[];
  commits: Commit.AsObject[];
  branches: Branch.AsObject[];
  messages: Message.AsObject[];
  loading: boolean;
  error: Error | null;
  selectedProject: Project.AsObject | null;
  selectedBranch: Branch.AsObject | null;
  selectedCommit: Commit.AsObject | null;
  fetchProjects: () => void;
  selectProject: (id: number) => void;
  selectBranch: (projectId: number, name: string) => void;
  build: (projectId: number, branch: string, sha: string) => void;
  copy: (projectId: number, sha: string) => void;
  install: (projectId: number, sha: string, color: string) => void;
}

export interface IProjectsState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

class Projects extends Block<IProjectsProps, IProjectsState> {
  public block = 'projects';

  constructor(props: IProjectsProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.props.fetchProjects();
    this.setState({ title: 'NABU projects' });
  }

  public content() {

    if (this.props.authenticated) {
      return (
        <Fragment>
          <Header title={this.state.title}/>
          <ExampleWithMods mod1={true}/>
          <ExampleWithMods mod1={true} mod2={true}/>
          <Bem block="Projects" elem="Intro">
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
                  ? <CommitsList
                    selectedProject={this.props.selectedProject}
                    selectedBranch={this.props.selectedBranch}
                    commits={this.props.commits}
                    selectedCommit={this.props.selectedCommit}
                    onBuild={this.props.build}
                    onCopy={this.props.copy}
                    onInstall={this.props.install}
                  />
                  : null
                }
              </div>
              <Log messages={this.props.messages}/>
            </div>
            <br/>
            <Link to={`/`}>HOME</Link>
          </Bem>
          <Footer/>
        </Fragment>
      );
    } else {

      return (
        <Fragment>
          <Bem block="Projects" elem="intro">
            NOT AUTHORIZED
          </Bem>
        </Fragment>
      );
    }
  }
}

function mapStateToProps(state: RootState) {
  return {
    authenticated: state.projects.authenticated,
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
    },
    install: (projectId: number, sha: string, color: string) => {
      dispatch(clearMessages());
      dispatch(installProject(projectId, sha, color));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
