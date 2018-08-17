import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import ProjectList from './List/ProjectList';
import ProjectView from './View/ProjectView';
import { RootAction } from '../../actions';
import { listProjects, selectProject } from '../../actions/projects';
import { Project } from '../../protobuf/nabu_pb';

type ProjectsProps = {
  projects: Project.AsObject[],
  loading: boolean,
  error: Error | null,
  selected: Project.AsObject | null,

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
            selected={this.props.selected}
            projects={this.props.projects}
            onProjectSelect={this.props.selectProject}
          />
          <div>
            { this.props.selected
              ? <ProjectView project={this.props.selected} />
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
    loading: state.projects.loading,
    error: state.projects.error,
    selected: state.projects.selected,
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
