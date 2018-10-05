import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import Header from '../../Header/HomeHeader';
import Footer from '../../Footer/App-Footer';
import { Link } from 'react-router-dom';
import './Home.css';

export interface IAppProps {
  path: string;
  authenticated: boolean;
  signOut: () => void;
}

export interface IAppState {
  title: string;
}

class Home extends Block<IAppProps, IAppState> {
  public block = 'page-home';

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      title: 'not loaded'
    };
  }

  public componentDidMount() {
    this.setState({ title: 'N.A.B.U. - Next awesome build unit' });
  }

  public content() {
    return (
      <Fragment>
        <Header title={this.state.title}/>
        <Bem block="page-home" elem="content">
          <Bem block="page-home" elem="how">
            <Bem block="page-home-how" elem="title"><h2>How it works</h2></Bem>
            <Bem block="page-home-how" elem="col1">1. Create project</Bem>
            <Bem block="page-home-how" elem="col2">2. Link a repo</Bem>
            <Bem block="page-home-how" elem="col3">3. Build and install</Bem>

          </Bem>
          <Bem block="page-home" elem="login">
            <Bem block="page-home-login" elem="login">
              <Link to={`/login`}>Login</Link>
            </Bem>
            <Bem block="page-home-login" elem="reg">
              <Link to={`/register`}>Register</Link>
            </Bem>
          </Bem>
          <Bem block="page-home" elem="features">
            <Bem block="page-home-features" elem="title"><h3>Features</h3></Bem>
            <Bem block="page-home-features" elem="col1">1</Bem>
            <Bem block="page-home-features" elem="col2">2</Bem>
            <Bem block="page-home-features" elem="col3">3</Bem>
            <Bem block="page-home-features" elem="col4">4</Bem>
          </Bem>
          <Bem block="page-home" elem="customers">cust</Bem>

        </Bem>
        <Footer/>
      </Fragment>
    );
  }
}

export default Home;
