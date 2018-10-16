import * as React from 'react';
import { Branch, Project } from '../../../../proto/v1/nabu_pb';

type BranchesListProps = {
  token: string,
  branches: Branch.AsObject[],
  selectedProject: Project.AsObject | null,
  selectedBranch: Branch.AsObject | null,
  onBranchSelect: (token: string, projectId: number, name: string) => void
};

const BranchesList: React.SFC<BranchesListProps> = (props) => {
  return (
    <div>
      <h5>Branches available</h5>
      {props.branches.map((branch, i) =>
        <div
          className="branches_item"
          style={props.selectedBranch && branch.name === props.selectedBranch.name
            ? { 'backgroundColor': 'rgba(0, 0, 0, 0.08)' }
            : {}
          }
          key={i}
          onClick={() => {
            if (branch.name) {
              props.onBranchSelect(props.token, (props.selectedProject || { id: 0 }).id, branch.name);
            }
          }}
        >
          <div style={{ display: 'flex' }}>
            <div>{branch.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesList;
