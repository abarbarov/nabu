import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
// import App from './blocks/App/App';
import './blocks/Page/Page.css';
import Stories from "./blocks/Story/Stories";

ReactDOM.render(
  <Provider store={store}>
    <div>
    {/*<App path="src/blocks/App/App.tsx" />*/}
    <Stories />
    </div>
  </Provider>,
  document.getElementById('root'));

