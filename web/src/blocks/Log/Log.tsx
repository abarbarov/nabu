import * as React from 'react';
import { Message } from '../../protobuf/nabu_pb';

type LogProps = {
  messages: Message.AsObject[];
};

const Logs: React.SFC<LogProps> = (props) => {
  return (
    <div>
      {props.messages.map((m, i) =>
        <div key={i}>
          <div style={{ display: 'flex' }}>
            <div>{m.id}</div>
            <div>{m.message}</div>
            <div>{m.status}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
