import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { authenticate } from '../../../actions/projects';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootAction } from '../../../actions';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import Header from '../../Header/AppHeader';
import Footer from '../../Footer/App-Footer';
import { Login as LoginForm } from '../../Forms/Login';
import { Error } from '../../../proto/v1/nabu_pb';
import './Login.css';

export interface ILoginProps {
  path: string;
  errors: Array<Error.AsObject> | null;
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
      title: 'not loaded',
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
          <LoginForm onAuthenticate={this.props.authenticate} errors={this.props.errors}/>
          <Bem block="app-login" elem="links">
            <br/>
            <Link to={`/register`}>Register</Link>
            <br/>
            <Link to={`/`}>Back to home page</Link>
          </Bem>
        </Bem>
        <Footer/>
      </Fragment>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    authenticated: state.projects.authenticated,
    errors: state.projects.errors,
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
