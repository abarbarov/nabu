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
        {/*<Bem block="app" elem="Title" tag="h1">{this.props.title}</Bem>*/}
        <Bem block="app" elem="title" tag="h1">
          {this.props.title}
          <Bem block="app" elem="item"/>
        </Bem>
      </Fragment>
    );
  }
}
