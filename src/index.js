import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import stores from './stores';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render((
  <Provider
    HeaderStore={stores.HeaderStore}
    BoardStore={stores.BoardStore}
    UtilStore={stores.UtilStore}
    CategoryStore={stores.CategoryStore}
    RouteStore={stores.RouteStore}
    UserStore={stores.UserStore}
    SettingStore={stores.SettingStore}
    PostLockerStore={stores.PostLockerStore}
    UserAlertStore={stores.UserAlertStore}
    UserFavoritePostStore={stores.UserFavoritePostStore}
    UserIgnoreStore={stores.UserIgnoreStore}
    UserStore2={stores.UserStore2}
  >
    <Router>
      <Route component={App} />
    </Router>
  </Provider>
), document.getElementById('root'));

serviceWorker.unregister();
