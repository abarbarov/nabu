import * as React from 'react';
import { Project } from '../../../protobuf/nabu_pb';

type ProjectListProps = {
  projects: Project.AsObject[],
  selected: Project.AsObject | null,
  onProjectSelect: (id: number) => void
};

const ProjectList: React.SFC<ProjectListProps> = (props) => {
  return (
    <div>
      {props.projects.map((project, i) =>
        <div style={props.selected && project.id === props.selected.id
            ? {'backgroundColor': 'rgba(0, 0, 0, 0.08)'}
            : {}
          }
          key={i}
          onClick={() => {
            if (project.id) {
              props.onProjectSelect(project.id);
            }
          }}>
          <div>
            <div>{project.title}</div>
            <div>{project.id} | {project.id}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
