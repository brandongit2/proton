import * as PropTypes from 'prop-types';
import * as React from 'react';

/**
 * A pannable, zoomable graph. Takes output from an equations component.
 *
 * @returns {React.Component} A graph component.
 */
export const Graph = ({className, style, json}) => (
    <div className={className} style={style}>
        <p>{JSON.stringify(json)}</p>
    </div>
);

Graph.propTypes = {
    className: PropTypes.string.isRequired,
    style:     PropTypes.object.isRequired,
    json:      PropTypes.object.isRequired
};
