import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { ChangeEvent } from 'react';
import './Login.css';
import { FormErrors } from '../FormErrors';
import { Error } from '../../proto/v1/nabu_pb';

export interface ILoginProps {
  errors: Array<Error.AsObject> | null;
  onAuthenticate: (username: string, password: string) => void;
}

export interface ILoginState {
  username: string;
  password: string;
  formErrors: { username: string, password: string };
  usernameValid: boolean;
  passwordValid: boolean;
  formValid: boolean;
}

export class Login extends Block<ILoginProps, ILoginState> {
  public block = 'form-login';

  static errorClass(error: string) {
    return (error.length === 0 ? '' : 'error');
  }

  constructor(props: ILoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      formErrors: { username: '', password: '' },
      usernameValid: false,
      passwordValid: false,
      formValid: false
    };
  }

  validateField(fieldName: string, value: string) {
    let fieldValidationErrors = this.state.formErrors;
    let usernameValid = this.state.usernameValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case 'username':
        usernameValid = value.length >= 5;
        fieldValidationErrors.username = usernameValid ? '' : ' is too short';
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

  public content() {
    let errorsText = this.props.errors && this.props.errors.map(e => e.text);
    let error = this.props.errors ? <div className="form-errors"><p className="error">{errorsText}</p></div> : '';

    return (
      <Fragment>
        <Bem block="form-login" elem="errors">
          <h3>Login</h3>
          <FormErrors formErrors={this.state.formErrors}/>
          {error}
        </Bem>
        <Bem tag="form" block="form-login" elem="form">
          <input
            className={`form-login-form input ${Login.errorClass(this.state.formErrors.username)}`}
            name="username"
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUserInput}
            onKeyPress={this.handleKeyDown}
          />
          <input
            className={`form-login-form input ${Login.errorClass(this.state.formErrors.password)}`}
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
            onClick={() => this.props.onAuthenticate(this.state.username, this.state.password)}
          >Login
          </button>
        </Bem>
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

      this.props.onAuthenticate(this.state.username, this.state.password);
    }
  }
}
