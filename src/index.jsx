import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader';
import * as request from 'request-promise';

import {Row} from './uiComponents/index';

import './index.css';

if (module.hot) {
    module.hot.accept();
}

window.panelCount = 0;

let App = ({json}) => (
    <div>
        {json.panels.rows.map(
            (row, i) => <Row key={i} height={row.height} panels={row.panels}></Row>
        )}
    </div>
);

App.propTypes = {
    json: PropTypes.object.isRequired
};

App = hot(module)(App);

request({
    method:  'GET',
    baseUrl: 'http://localhost:2000',
    uri:     '/workspaces/graphing.json',
    json:    true
})
    .then(res => {
        ReactDOM.render(<App json={res} />, document.getElementById('root'));
    });
