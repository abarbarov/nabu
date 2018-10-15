import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { Dispatch } from 'redux';
import Header from '../../Header/AppHeader';
import Footer from '../../Footer/App-Footer';
import { Link } from 'react-router-dom';
import { RootState } from '../../../store';
import { connect } from 'react-redux';
import { Branch, Commit, Error, Message, Project, User } from '../../../protobuf/nabu_pb';
import Log from '../../Log/Log';
import { RootAction } from '../../../actions';
import {
  buildProject,
  clearMessages,
  copyProject,
  initProjects,
  installProject,
  listBranches,
  listCommits,
  listProjects,
  restartProject,
  selectBranch,
  selectProject
} from '../../../actions/projects';
import ProjectList from './List/ProjectList';
import CommitsList from './List/CommitsList';
import BranchesList from './List/BranchesList';
import { Button } from '../../Button/Button';
import './Projects.css';

export interface IProjectsProps {
  authenticated: boolean;
  projects: Project.AsObject[];
  commits: Commit.AsObject[];
  branches: Branch.AsObject[];
  messages: Message.AsObject[];
  loading: boolean;
  errors: Array<Error.AsObject> | null;
  selectedProject: Project.AsObject | null;
  selectedBranch: Branch.AsObject | null;
  selectedCommit: Commit.AsObject | null;
  fetchProjects: (token: string) => void;
  selectProject: (token: string, projectId: number) => void;
  selectBranch: (token: string, projectId: number, name: string) => void;
  build: (token: string, projectId: number, branch: string, sha: string) => void;
  copy: (token: string, projectId: number, sha: string) => void;
  install: (token: string, projectId: number, sha: string, color: string) => void;
  restart: (token: string, projectId: number, sha: string, color: string) => void;
  user: User.AsObject | null;
}

export interface IProjectsState {
  title: string;
}

class Projects extends Block<IProjectsProps, IProjectsState> {
  public block = 'page-projects';

  constructor(props: IProjectsProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.props.fetchProjects((this.props.user && this.props.user.token) || '');
    this.setState({ title: 'NABU projects' });
  }

  public content() {
    let errorsText = this.props.errors && this.props.errors.map(e => e.text);
    let error = this.props.errors ? <div className="form-errors"><p className="error">{errorsText}</p></div> : '';

    if (this.props.authenticated) {
      return (
        <Fragment>
          <Header title={this.state.title}/>
          <Bem block="app" elem="projects">
            <div>Next Awesome Build Unit</div>
            {error}
            <div>
              Projects available
            </div>
            <div>
              <Button color="blue">Add new</Button>
            </div>
            <hr/>
            <div>
              <ProjectList
                token={(this.props.user && this.props.user.token) || ''}
                selectedProject={this.props.selectedProject}
                projects={this.props.projects}
                onProjectSelect={this.props.selectProject}
              />

              <div>
                {this.props.selectedProject
                  ? <BranchesList
                    token={(this.props.user && this.props.user.token) || ''}
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
                    token={(this.props.user && this.props.user.token) || ''}
                    selectedProject={this.props.selectedProject}
                    selectedBranch={this.props.selectedBranch}
                    commits={this.props.commits}
                    selectedCommit={this.props.selectedCommit}
                    onBuild={this.props.build}
                    onCopy={this.props.copy}
                    onInstall={this.props.install}
                    onRestart={this.props.restart}
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
    user: state.projects.user,
    projects: Object.keys(state.projects.projects).map(key => state.projects.projects[parseInt(key, 10)]),
    commits: Object.keys(state.projects.commits).map(key => state.projects.commits[key]),
    branches: Object.keys(state.projects.branches).map(key => state.projects.branches[key]),
    messages: Object.keys(state.projects.messages).map(key => state.projects.messages[parseInt(key, 10)]),
    loading: state.projects.loading,
    errors: state.projects.errors,
    selectedProject: state.projects.selectedProject,
    selectedCommit: state.projects.selectedCommit,
    selectedBranch: state.projects.selectedBranch,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    fetchProjects: (token: string) => {
      dispatch(initProjects());
      dispatch(listProjects(token));
    },
    selectProject: (token: string, projectId: number) => {
      dispatch(selectProject(projectId));
      dispatch(listBranches(token, projectId));
    },
    selectBranch: (token: string, projectId: number, name: string) => {
      dispatch(selectBranch(projectId, name));
      dispatch(listCommits(token, projectId, name));
    },
    build: (token: string, projectId: number, branch: string, sha: string) => {
      dispatch(clearMessages());
      dispatch(buildProject(token, projectId, branch, sha));
    },
    copy: (token: string, projectId: number, sha: string) => {
      dispatch(clearMessages());
      dispatch(copyProject(token, projectId, sha));
    },
    install: (token: string, projectId: number, sha: string, color: string) => {
      dispatch(clearMessages());
      dispatch(installProject(token, projectId, sha, color));
    },
    restart: (token: string, projectId: number, sha: string, color: string) => {
      dispatch(clearMessages());
      dispatch(restartProject(token, projectId, sha, color));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
