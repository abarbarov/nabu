import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import ProjectList from './List/ProjectList';
import ProjectView from './View/ProjectView';
import { RootAction } from '../../actions';
import { listProjects, selectProject } from '../../actions/projects';
import { Project, Commit } from '../../protobuf/nabu_pb';

type ProjectsProps = {
  projects: Project.AsObject[],
  commits: Commit.AsObject[],
  loading: boolean,
  error: Error | null,
  selectedProject: Project.AsObject | null,
  selectedCommit: Commit.AsObject | null,
  fetchProjects: () => void,
  selectProject: (id: number) => void,
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
          <ProjectList
            selectedProject={this.props.selectedProject}
            projects={this.props.projects}
            onProjectSelect={this.props.selectProject}
          />
          <div>
            { this.props.selectedProject
              ? <ProjectView project={this.props.selectedProject} commits={this.props.commits} />
              : null
            }
          </div>
        </div>

        <div>
          <button>Add new</button>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state: RootState) {
  return {
    projects: Object.keys(state.projects.projects).map(key => state.projects.projects[parseInt(key, 10)]),
    commits: Object.keys(state.projects.commits).map(key=>state.projects.commits[key]),
    loading: state.projects.loading,
    error: state.projects.error,
    selectedProject: state.projects.selectedProject,
    selectedCommit: state.projects.selectedCommit,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    fetchProjects: () => {
      dispatch(listProjects());
    },
    selectProject: (projectId: number) => {
      dispatch(selectProject(projectId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
