import { Bem, Elem } from 'bem-react-core';
import * as React from 'react';
import { Fragment } from 'react';

import './App-Footer.css';

export interface IElemProps {
}

export default class AppFooter extends Elem<IElemProps> {
  public block = 'app';
  public elem = 'footer';

  public tag() {
    return 'footer';
  }

  public content() {
    return (
      <Fragment>
        <Bem block="app-footer" elem="column">
          <Bem block="app-footer" elem="list" tag="ul">
            <li>
              <h3>Project</h3>
            </li>
            <li>
              <a target="_blank" href="https://github.com/abarbarov/nabu.ci">GitHub</a>
            </li>
            <li>
              <a target="_blank" href="#">Documentation</a>
            </li>
            <li>
              <a target="_blank" href="#">Plugin Index</a>
            </li>
            <li>
              <a href="/license">Terms</a>
            </li>
          </Bem>
        </Bem>
        <Bem block="app-footer" elem="column">
          <Bem block="app-footer" elem="list" tag="ul">
            <li>
              <h3>Community</h3>
            </li>
            <li>
              <a target="_blank" href="https://github.com/abarbarov">GitHub</a>
            </li>
            <li>
              <a target="_blank" href="https://twitter.com/abarbarov">Twitter</a>
            </li>
            <li>revision: 18.09.09</li>
          </Bem>
        </Bem>
      </Fragment>
    );
  }
}
