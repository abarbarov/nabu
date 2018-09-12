import { Bem, Elem } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import './App-Header.css';

export interface IElemProps {
  title: string;
}

export default class AppHeader extends Elem<IElemProps> {
  public block = 'App';
  public elem = 'Header';

  public tag() {
    return 'header';
  }

  public content() {
    return (
      <Fragment>
        <Bem block="App" elem="Title" tag="h1">{this.props.title}</Bem>
      </Fragment>
    );
  }

}
