import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader';
import request from 'request-promise';
import {generate} from 'shortid';

import {Divider, Row} from './uiComponents';

require('./index.scss');

if (module.hot) {
    module.hot.accept();
}

let App = ({json}) => {
    let rowId = 0;

    return (
        <div className="app">
            {json.panels.rows.map(
                row => (
                    <React.Fragment key={generate()}>
                        <Row style={{flexGrow: row.height}} id={rowId++} panels={row.panels} />
                        <Divider className="divider horizontal" onMove={() => {}} id={generate()} />
                    </React.Fragment>
                )
            )}
        </div>
    );
};

App.propTypes = {
    json: PropTypes.object.isRequired
};

App = hot(module)(App);

request({
    method:  'GET',
    baseUrl: `http://${window.location.hostname}:${window.location.port}`,
    uri:     '/workspaces/graphing.json',
    json:    true
})
    .then(res => {
        ReactDOM.render(<App json={res} />, document.getElementById('root'));
    });
