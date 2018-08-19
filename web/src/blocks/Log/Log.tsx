import * as React from 'react';

type LogProps = {
  messages: string[];
};

const Logs: React.SFC<LogProps> = (props) => {
  return (
    <div>
      {props.messages.map((m, i) =>
        <div key={i}>
          <div style={{ display: 'flex' }}>
            <div>{m}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
