import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { ChangeEvent, Fragment } from 'react';
import { register } from '../../../actions/projects';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootAction } from '../../../actions';
import { connect } from 'react-redux';
import { RootState } from '../../../store';
import './Register.css';
import Header from '../../Header/AppHeader';
import Footer from '../../Footer/App-Footer';
import { FormErrors } from '../../FormErrors';
import { Error } from '../../../protobuf/nabu_pb';

export interface ILoginProps {
  path: string;
  errors: Array<Error.AsObject> | null;
  register: (email: string, password: string) => void;
}

export interface ILoginState {
  title: string;
  email: string;
  password: string;
  formErrors: { email: string, password: string };
  emailValid: boolean;
  passwordValid: boolean;
  formValid: boolean;
}

class Register extends Block<ILoginProps, ILoginState> {
  public block = 'page-login';

  static errorClass(error: string) {
    return (error.length === 0 ? '' : 'error');
  }

  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      title: 'not loaded',
      email: '',
      password: '',
      formErrors: { email: '', password: '' },
      emailValid: false,
      passwordValid: false,
      formValid: false
    };
  }

  public componentDidMount() {
    this.setState({ title: 'Login to N.A.B.U. app' });
  }

  validateField(fieldName: string, value: string) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'email':
        emailValid = !!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
        break;
      case 'password':
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '' : ' is too short';
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid
      },
      this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid
    });
  }

  public content() {
    let errorsText = this.props.errors && this.props.errors.map(e => e.text);
    let error = this.props.errors ? <div className="form-errors"><p className="error">{errorsText}</p></div> : '';

    return (
      <Fragment>
        <Header title={this.state.title}/>
        <Bem block="app" elem="login">
          <h3>Register</h3>
          <FormErrors formErrors={this.state.formErrors}/>
          {error}
          <Bem tag="form" block="app-login" elem="form">
            <input
              className={`app-login-form input ${Register.errorClass(this.state.formErrors.email)}`}
              name="email"
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleUserInput}
              onKeyPress={this.handleKeyDown}
            />
            <input
              className={`app-login-form input ${Register.errorClass(this.state.formErrors.password)}`}
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleUserInput}
              onKeyDown={this.handleKeyDown}
            />
            <button
              type="button"
              className="btn btn_color_blue"
              disabled={!this.state.formValid}
              onClick={() => this.props.register(this.state.email, this.state.password)}
            >Register
            </button>
          </Bem>
          <br/>
          <Link to={`/login`}>Login</Link>
          <br/>
          <Link to={`/`}>Back to home page</Link>
        </Bem>
        <Footer/>
      </Fragment>
    );
  }

  handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    // @ts-ignore
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      this.props.register(this.state.email, this.state.password);
    }
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
    register: (email: string, password: string) => {
      dispatch(register(email, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
