import * as request from 'request-promise';

import {buildUi} from './uiBuilder';

import './style.css';

if (module.hot) {
    module.hot.accept();
}

request({
    method: 'GET',
    uri: 'http://localhost:2000/testfiles/graphing.json',
    json: true
})
    .then((res) => {
        console.log(res);
    });
