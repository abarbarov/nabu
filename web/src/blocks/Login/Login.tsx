import { Block, Bem } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { authenticate } from '../../actions/projects';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootAction } from '../../actions';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import './Login.css';
import Header from '../App/Header/App-Header';
import Footer from '../App/Footer/App-Footer';

export interface ILoginProps {
  path: string;
  error: Error | null;
  authenticate: (username: string, password: string) => void;
}

export interface ILoginState {
  title: string;
}

class Login extends Block<ILoginProps, ILoginState> {
  public block = 'page-login';

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
        <Header title={this.state.title}/>
        <Bem block="app" elem="login">
          LOGIN <br/>
          <form>
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
            <button type="button" onClick={() => this.props.authenticate('test', 'test')} className="blue">Sign In
            </button>
          </form>
          {this.props.error}
          <Link to={`/`}>HOME</Link>
        </Bem>
        {/*<ExampleWithMods mod1={true}/>*/}
        {/*<ExampleWithMods mod1={true} mod2={true}/>*/}

        <Footer/>
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
    authenticate: (username: string, password: string) => {
      dispatch(authenticate(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
