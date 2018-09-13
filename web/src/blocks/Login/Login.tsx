import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';

import './Login.css';
import { Link } from 'react-router-dom';

export interface ILoginProps {
  path: string;
}

export interface ILoginState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

class Login extends Block<ILoginProps, ILoginState> {
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

  submit(values) {
    console.log(values);
  }

  public content() {
    return (
      <Fragment>
        <ExampleWithMods mod1={true}/>
        <ExampleWithMods mod1={true} mod2={true}/>
        <Bem block="Login" elem="Intro">

          LOGIN<br/>

          <form onSubmit={handleSubmit(this.submit)}>
            <input
              name="email"
              type="text"
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
            />
            <button type="submit" className="blue">Sign In</button>
          </form>

          <Link to={`/`}>HOME</Link>
        </Bem>
      </Fragment>
    );
  }
}

export default reduxForm({ form: 'signin' })(Login);
