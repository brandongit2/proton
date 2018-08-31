import React from 'react';
import ReactDOM from 'react-dom';
import request from 'request-promise';
import {hot} from 'react-hot-loader';
import {Provider} from 'react-redux';

import {App} from './containers';
import {hydrateUI} from './actions';
import store from './store';

require('./index.scss');

const HotApp = hot(module)(App);

ReactDOM.render(
    <Provider store={store}>
        <HotApp />
    </Provider>,
    document.getElementById('root')
);

request({
    method:  'GET',
    baseUrl: `http://${window.location.hostname}:${window.location.port}`,
    uri:     '/workspaces/graphing.json',
    json:    true
}).then(res => {
    store.dispatch(hydrateUI(res));
});

if (module.hot) {
    module.hot.accept();
}
