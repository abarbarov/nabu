import * as React from 'react';
import { Project } from '../../../protobuf/nabu_pb';

type ProjectListProps = {
  projects: Project.AsObject[],
  selectedProject: Project.AsObject | null,
  onProjectSelect: (id: number) => void
};

const ProjectList: React.SFC<ProjectListProps> = (props) => {
  return (
    <div>
      {props.projects.map((project, i) =>
        <div style={props.selectedProject && project.id === props.selectedProject.id
            ? {'backgroundColor': 'rgba(0, 0, 0, 0.08)'}
            : {}
          }
          key={i}
          onClick={() => {
            if (project.id) {
              props.onProjectSelect(project.id);
            }
          }}>
          <div style={{display: "flex"}}>
            <div>{project.id} | </div>
            <div>{project.title} | </div>
            <div>{project.repository}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
