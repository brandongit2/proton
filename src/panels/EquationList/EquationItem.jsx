import katex from 'katex';
import React from 'react';

export let EquationItem = () => (
    <div className="equation-item">
        {/* eslint-disable react/jsx-closing-bracket-location, react/jsx-closing-tag-location, react/no-danger */}
        <span dangerouslySetInnerHTML={{
            __html: katex.renderToString(String.raw`x`)
        }}></span>
        {/* eslint-enable react/jsx-closing-bracket-location, react/jsx-closing-tag-location, react/no-danger */}
    </div>
);
