import * as React from 'react';
import { Message } from '../../protobuf/nabu_pb';

type LogProps = {
  messages: Message.AsObject[];
};

const Logs: React.SFC<LogProps> = (props) => {
  function getDate(m: Message.AsObject | undefined) {
    if (m && m.timestamp) {
      return new Date(m.timestamp.seconds * 1000).toISOString();
    }

    return '';
  }

  return (
    <div>
      {props.messages.map((m, i) =>
        <div key={i}>
          <div style={{ display: 'flex' }}>
            <div>{getDate(m)}</div>
            <div>{m && m.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
