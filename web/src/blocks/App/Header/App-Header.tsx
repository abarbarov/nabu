import { Bem, Elem } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import './App-Header.css';

export interface IElemProps {
  title: string;
}

export default class AppHeader extends Elem<IElemProps> {
  public block = 'app';
  public elem = 'header';

  public tag() {
    return 'header';
  }

  public content() {
    return (
      <Fragment>
        <Bem block="app-header" elem="item">
          <Bem tag="a" elem="header-link" href="/">Nodes</Bem>
        </Bem>
        <Bem block="app-header" elem="item">
          <Bem tag="a" elem="header-link" href="/projects">Projects</Bem>
        </Bem>
        <Bem block="app-header" elem="item">
          <Bem tag="a" elem="header-link" href="/health">Health</Bem>
        </Bem>
        <Bem block="app-header" elem="item">
          <Bem tag="a" elem="header-link" href="/logout">Logout</Bem>
        </Bem>
      </Fragment>
    );
  }
}
