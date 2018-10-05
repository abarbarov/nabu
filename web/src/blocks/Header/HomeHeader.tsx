import { Bem, Elem } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootAction } from '../../actions';
import { RootState } from '../../store';
import { signOut } from '../../actions/projects';
import './AppHeader.css';

export interface IHeaderProps {
  authenticated?: boolean;
  signOut: () => void;
  title: string;
}

class HomeHeader extends Elem<IHeaderProps> {
  public block = 'app';
  public elem = 'header';

  public tag() {
    return 'header';
  }

  public content() {
    let signOutBtn = (this.props.authenticated) ?
      <Bem tag="a" block="app-header" elem="link" onClick={(e) => { e.preventDefault(); this.props.signOut(); }} >Logout</Bem> :
      <Link to={`/login`} className="app-header-link">LOGIN</Link>;

    return (
      <Fragment>
        <Bem block="app-header" elem="item">
          {signOutBtn}
        </Bem>
      </Fragment>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    authenticated: state.projects.authenticated,
  };
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>) {
  return {
    signOut: () => {
      dispatch(signOut());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
