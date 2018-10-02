import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { authenticate } from '../../../actions/projects';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootAction } from '../../../actions';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import './Login.css';
import Header from '../../Header/App-Header';
import Footer from '../../Footer/App-Footer';

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
    this.setState({ title: 'Login to N.A.B.U. app' });
  }

  public content() {
    return (
      <Fragment>
        <Header title={this.state.title}/>
        <Bem block="app" elem="login">
          <h3>Login</h3>
          <Bem tag="form" block="app-login" elem="form">
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
            <button type="button" className="btn btn_color_blue" onClick={() => this.props.authenticate('test', 'test')}>Sign In </button>
          </Bem>
          {this.props.error}
          <Link to={`/`}>HOME</Link>
        </Bem>
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
      debugger;
      dispatch(authenticate(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
