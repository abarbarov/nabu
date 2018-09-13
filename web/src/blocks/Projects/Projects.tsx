import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';

import './Projects.css';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { connect } from 'react-redux';

export interface IProjectsProps {
  path: string;
  authenticated: boolean;
}

export interface IProjectsState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

class Projects extends Block<IProjectsProps, IProjectsState> {
  public block = 'Projects';

  constructor(props: IProjectsProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.setState({ title: 'Welcome to PROJECTS page' });
  }

  public content() {

    if (this.props.authenticated) {
      return (
        <Fragment>
          <ExampleWithMods mod1={true}/>
          <ExampleWithMods mod1={true} mod2={true}/>
          <Bem block="Projects" elem="Intro">
            PROJECTS
            <br/>
            <Link to={`/`}>HOME</Link>
          </Bem>
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
  };
}

export default connect(mapStateToProps)(Projects);
