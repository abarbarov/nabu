import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../../Example/_mod1/Example_mod1';
import mod2 from '../../Example/_mod2/Example_mod2';
import Example from '../../Example/Example';

import './Register.css';
import { Link } from 'react-router-dom';

export interface IRegisterProps {
  path: string;
}

export interface IRegisterState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

export default class Register extends Block<IRegisterProps, IRegisterState> {
  public block = 'Register';

  constructor(props: IRegisterProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.setState({ title: 'Welcome to LOGIN page' });
  }

  public content() {
    return (
      <Fragment>
        <ExampleWithMods mod1={true}/>
        <ExampleWithMods mod1={true} mod2={true}/>
        <Bem block="Register" elem="Intro">
          REGISTER<br/>
          <Link to={`/`}>HOME</Link>
        </Bem>
      </Fragment>
    );
  }
}
