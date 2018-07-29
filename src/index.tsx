import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Greeting } from './modules';
import { cube } from './math';
import './style.css';

let element = document.createElement('div');
element.innerHTML = '5 cubed is ' + cube(5);
document.body.appendChild(element);

ReactDOM.render(
    <Greeting name='Math App'/>,
    document.getElementById('app')
);
