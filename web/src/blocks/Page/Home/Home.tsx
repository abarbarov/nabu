import { Bem, Block } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';
import Header from '../../Header/App-Header';
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
          <Link to={`/register`}>REGISTER</Link>
          <br/>
          <Link to={`/projects`}>PROJECTS</Link>
          <br/>
        </Bem>
        <Footer/>
      </Fragment>
    );
  }
}

export default Home;
