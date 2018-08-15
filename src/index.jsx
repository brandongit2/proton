import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as request from 'request-promise';

import App from './uiBuilder';

import './index.css';

if (module.hot) {
    module.hot.accept();
}

request({
    method:  'GET',
    baseUrl: 'http://localhost:2000',
    uri:     '/testfiles/graphing.json',
    json:    true
})
    .then(res => {
        ReactDOM.render(<App json={res} />, document.getElementById('root'));
    });
