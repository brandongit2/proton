import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './style.css';

const Box = ({color}: {color: string}) => <div style={{
    background: color,
    width: '20px',
    height: '20px'
}} />;

ReactDOM.render(
    <div>
        <p>body text</p>
        <Box color="#ff0000" />
        <Box color="#00ff00" />
        <Box color="#0000ff" />
    </div>,
    document.getElementById('root')
);
