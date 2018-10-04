import * as React from 'react';
import { Project } from '../../../../protobuf/nabu_pb';
import './ProjectList.css';

type ProjectListProps = {
  token: string,
  projects: Project.AsObject[],
  selectedProject: Project.AsObject | null,
  onProjectSelect: (token: string, projectId: number) => void
};

const ProjectList: React.SFC<ProjectListProps> = (props) => {
  return (
    <div className="projects">
      <div className="projects-row projects-row_title">
        <div>ID</div>
        <div>|Title</div>
        <div>|Repository</div>
      </div>
      {props.projects.map((project, i) =>
        <div
          className={`projects-row ${props.selectedProject && project.id === props.selectedProject.id ? 'projects-row_selected' : ''}`}
          key={i}
          onClick={() => {
            if (project.id) {
              props.onProjectSelect(props.token, project.id);
            }
          }}
        >
          <div>{project.id}</div>
          <div>| {project.title}</div>
          <div>| {project.repository}</div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
