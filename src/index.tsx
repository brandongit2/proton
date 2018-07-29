import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { cube } from './math';
import './style.css';

let element = document.createElement('div');
element.innerHTML = '5 cubed is ' + cube(5);
document.body.appendChild(element);

ReactDOM.render(
    <div>
        <h1>This is a React element.</h1>
    </div>,
    document.getElementById('app')
);
