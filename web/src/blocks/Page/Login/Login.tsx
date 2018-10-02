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
import { FormErrors } from '../../FormErrors';

export interface ILoginProps {
  path: string;
  error: Error | null;
  authenticate: (username: string, password: string) => void;
}

export interface ILoginState {
  title: string;
  username: string;
  password: string;
  formErrors: { username: string, password: string };
  usernameValid: boolean;
  passwordValid: boolean;
  formValid: boolean;
}

class Login extends Block<ILoginProps, ILoginState> {
  public block = 'page-login';

  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      title: 'not loaded',
      username: '',
      password: '',
      formErrors: { username: '', password: '' },
      usernameValid: false,
      passwordValid: false,
      formValid: false
    };
  }

  public componentDidMount() {
    this.setState({ title: 'Login to N.A.B.U. app' });
  }

  // @ts-ignore
  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    // @ts-ignore
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  validateField(fieldName: string, value: string) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'username':
        usernameValid = value.length >= 5;
        fieldValidationErrors.username = usernameValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 5;
        fieldValidationErrors.password = passwordValid ? '' : ' is too short';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        usernameValid: usernameValid,
        passwordValid: passwordValid
      },
      this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.usernameValid && this.state.passwordValid
    });
  }

  errorClass(error: string) {
    return (error.length === 0 ? '' : 'error');
  }

  public content() {
    let error = this.props.error ? <Bem elem="error">{this.props.error.message}</Bem> : '';

    return (
      <Fragment>
        <Header title={this.state.title}/>
        <Bem block="app" elem="login">
          <h3>Login</h3>
          <Bem tag="form" block="app-login" elem="form">
            <input
              className={`${this.errorClass(this.state.formErrors.username)}`}
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleUserInput}
            />
            <input
              className={`${this.errorClass(this.state.formErrors.password)}`}
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleUserInput}
            />
            <button
              type="button"
              className="btn btn_color_blue"
              disabled={!this.state.formValid}
              onClick={() => this.props.authenticate(this.state.username, this.state.password)}
            >Sign In
            </button>
          </Bem>
          {error}
          <FormErrors formErrors={this.state.formErrors}/>
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
      dispatch(authenticate(username, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
