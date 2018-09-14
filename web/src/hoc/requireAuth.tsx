import * as React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { RootState } from '../store';

export interface IAuthProps {
  authenticated: boolean;
}

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  class WithAuth extends React.Component<P & IAuthProps> {
    componentWillMount() {
      if (!this.props.authenticated) {
        history.push('/login');
      }
    }

    componentWillUpdate(nextProps: IAuthProps) {
      if (!nextProps.authenticated) {
        history.push('/login');
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  function mapStateToProps(state: RootState) {
    return { authenticated: state.projects.authenticated };
  }

  return connect(mapStateToProps)(WithAuth);
}
