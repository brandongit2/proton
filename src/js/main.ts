declare function require(name: string);

let $ = require('jquery');
let React = require('react');
let ReactDOM = require('react-dom');

$(function() {
    ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('root');
    );
});
