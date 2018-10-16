import * as React from 'react';
import { Fragment } from 'react';
import { Message } from '../../proto/v1/nabu_pb';
import './Log.css';
import { Bem, Block } from 'bem-react-core';

type LogProps = {
  messages: Message.AsObject[];
};

class Log extends Block<LogProps, {}> {
  public block = 'log';

  constructor(props: LogProps) {
    super(props);
  }

  getDate(m: Message.AsObject | undefined) {
    if (m && m.timestamp) {
      return new Date(m.timestamp.seconds * 1000).toISOString();
    }

    return '';
  }

  public content() {
    if (this.props.messages.length) {
      return (
        <Fragment>
          <Bem block="log" elem="container" tag="div">
            {this.props.messages.map((m, i) =>
              <Bem tag="div" block="log" elem="row" key={i}>
                <Bem tag="b" block="log-row" elem="time">{this.getDate(m)}</Bem>
                <Bem tag="span" block="log-row" elem="info">{m && m.message}</Bem>
              </Bem>
            )}
          </Bem>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Bem block="log" elem="container" tag="div"/>
      </Fragment>
    );
  }
}

export default Log;
