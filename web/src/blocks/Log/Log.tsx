import * as React from 'react';
import { Message } from '../../protobuf/nabu_pb';
import { Timestamp } from '../../../node_modules/@types/google-protobuf/google/protobuf/timestamp_pb';

type LogProps = {
  messages: Message.AsObject[];
};

const Logs: React.SFC<LogProps> = (props) => {
  function getDate(timestamp: Timestamp.AsObject | undefined) {
    if (timestamp) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }

    return '';
  }

  return (
    <div>
      {props.messages.map((m, i) =>
        <div key={i}>
          <div style={{ display: 'flex' }}>
            <div>{getDate(m.timestamp)}</div>
            <div>{m.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
