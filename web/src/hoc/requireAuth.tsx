import * as React from 'react';
import {connect} from 'react-redux';
import history from '../history';
import store, {RootState} from '../store';
import {SIGN_IN} from '../actions/projects';

export interface IAuthProps {
  authenticated: boolean;
}

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  class WithAuth extends React.Component<P & IAuthProps> {
    componentWillMount() {
      if (!this.props.authenticated) {
        this.loadUser();
        if (!this.props.authenticated) {
          history.push('/login');
        }
      }
    }

    componentWillUpdate(nextProps: IAuthProps) {
      if (!nextProps.authenticated) {
        history.push('/login');
      }
    }

    loadUser() {
      const user = localStorage.getItem('user');

      if (user) {
        let userObj = JSON.parse(user);
        store.dispatch({type: SIGN_IN, payload: userObj});
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  function mapStateToProps(state: RootState) {
    return {authenticated: state.projects.authenticated};
  }

  // @ts-ignore
  return connect(mapStateToProps)(WithAuth);
}
