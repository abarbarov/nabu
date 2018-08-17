import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import StoryList from './List/StoryList';
import StoryView from './View/StoryView';
import ProjectView from './View/ProjectView';
import { RootAction } from '../../actions';
import { listProjects, selectProject } from '../../actions/stories';
import { Project } from '../../protobuf/nabu_pb';

type ProjectsProps = {
  stories: Project.AsObject[],
  loading: boolean,
  error: Error | null,
  selected: Project.AsObject | null,

  fetchProjects: () => void,
  selectStory: (id: number) => void,
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
          <div>
            <StoryList
              selected={this.props.selected}
              stories={this.props.stories}
              onStorySelect={this.props.selectStory}
            />
          </div>

          <div>
            { this.props.selected
              ? <StoryView story={this.props.selected} />
              : null
            }
            { this.props.selected
              ? <ProjectView project={this.props.selected} />
              : null
            }
          </div>
        </div>

      </div>
    );
  }

}

function mapStateToProps(state: RootState) {
  return {
    stories: Object.keys(state.projects.projects).map(key => state.projects.projects[parseInt(key, 10)]),
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
    selectStory: (storyId: number) => {
      dispatch(selectProject(storyId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
