import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';

import './Login.css';

export interface ILoginProps {
  path: string;
}

export interface ILoginState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

export default class Login extends Block<ILoginProps, ILoginState> {
  public block = 'Login';

  constructor(props: ILoginProps) {
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
        <Bem block="Login" elem="Intro">
          LOGIN<br/>
          To get started, edit <code>{this.props.path}</code> and save to reload.
        </Bem>
      </Fragment>
    );
  }
}
