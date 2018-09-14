import { Bem, Block, withMods } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import mod1 from '../Example/_mod1/Example_mod1';
import mod2 from '../Example/_mod2/Example_mod2';
import Example from '../Example/Example';
import Header from './Header/App-Header';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { Dispatch } from 'redux';
import { RootAction } from '../../actions';
import { signOut } from '../../actions/projects';
import { connect } from 'react-redux';
import './App.css';

export interface IAppProps {
  path: string;
  authenticated: boolean;
  signOut: () => void;
}

export interface IAppState {
  title: string;
}

const ExampleWithMods = withMods(Example, mod1, mod2);

class App extends Block<IAppProps, IAppState> {
  public block = 'App';

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.setState({ title: 'Welcome to BEM in the TypeScript world' });
  }

  public content() {
    let signOutBtn = (this.props.authenticated) ? <button type="button" onClick={() => this.props.signOut()}>SIGN OUT</button> : '';

    return (
      <Fragment>
        <Header title={this.state.title}/>
        <ExampleWithMods mod1={true}/>
        <ExampleWithMods mod1={true} mod2={true}/>
        <Bem block="App" elem="Intro">
          To get started, edit <code>{this.props.path}</code> and save to reload.
          <br/>
          <Link to={`/login`}>LOGIN</Link>
          <br/>
          <Link to={`/register`}>REGISTER</Link>
          <br/>
          <Link to={`/projects`}>PROJECTS</Link>
          <br/>
          {signOutBtn}
        </Bem>
      </Fragment>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    authenticated: state.projects.authenticated,
    error: state.projects.error,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    signOut: () => {
      dispatch(signOut());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
