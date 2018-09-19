import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './blocks/Page/Home/Home';
import Login from './blocks/Page/Login/Login';
import Projects from './blocks/Page/Projects/Projects';
import Register from './blocks/Page/Register/Register';
import { Route, Router, Switch } from 'react-router-dom';
import { SIGN_IN } from './actions/projects';
import history from './history';
import withAuth from './hoc/requireAuth';
import skipAuth from './hoc/skipAuth';
import './blocks/Page/Page.css';

const user = localStorage.getItem('user');

if (user) {
  let userObj = JSON.parse(user);
  store.dispatch({ type: SIGN_IN, payload: userObj });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/login" component={skipAuth(Login)}/>
        <Route path="/register" component={skipAuth(Register)}/>
        <Route path="/projects" component={withAuth(Projects)}/>
      </Switch>
    </Router>
    {/*<Projects/>*/}
  </Provider>,
  document.getElementById('root'));
