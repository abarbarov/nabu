import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './blocks/App/App';
import Login from './blocks/Login/Login';
import Projects from './blocks/Projects/Projects';
import Register from './blocks/Register/Register';
import './blocks/Page/Page.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import Projects from './blocks/Project/Projects';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={App}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/projects" component={Projects}/>
      </Switch>
    </BrowserRouter>
    {/*<Projects/>*/}
  </Provider>,
  document.getElementById('root'));
