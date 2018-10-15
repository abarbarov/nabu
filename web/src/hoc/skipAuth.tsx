import * as React from 'react';
import {connect} from 'react-redux';
import history from '../history';
import {RootState} from '../store';

export interface IAuthProps {
  authenticated: boolean;
}

export default function skipAuth<P extends object>(Component: React.ComponentType<P>) {
  class SkipAuth extends React.Component<P & IAuthProps> {
    componentWillMount() {
      if (this.props.authenticated) {
        history.push('/projects');
      }
    }

    componentWillUpdate(nextProps: IAuthProps) {
      if (nextProps.authenticated) {
        history.push('/projects');
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
  return connect(mapStateToProps)(SkipAuth);
}
