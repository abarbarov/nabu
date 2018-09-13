import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';
import { authenticate } from '../../actions/projects';

import './Login.css';
import { Link } from 'react-router-dom';
// import { RootState } from "../../store";
import { Dispatch } from 'redux';
import { RootAction } from '../../actions';
import { connect } from 'react-redux';

export interface ILoginProps {
  path: string;
  login: (username: string, password: string) => void;
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

  public content() {
    return (
      <Fragment>
        <ExampleWithMods mod1={true}/>
        <ExampleWithMods mod1={true} mod2={true}/>
        <Bem block="Login" elem="Intro">

          LOGIN <br/>
          <form onSubmit={() => this.props.login('test', 'test')}>
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

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    signin: (username: string, password: string) => {
      debugger;
      dispatch(authenticate(username, password));
    }
  };
}

export default connect(mapDispatchToProps)(Login);
