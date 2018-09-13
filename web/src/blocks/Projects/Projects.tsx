import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';

import './Projects.css';
import { Link } from 'react-router-dom';

export interface IProjectsProps {
  path: string;
}

export interface IProjectsState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

export default class Projects extends Block<IProjectsProps, IProjectsState> {
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
  }
}
