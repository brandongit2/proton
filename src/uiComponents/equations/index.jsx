import * as PropTypes from 'prop-types';
import * as React from 'react';

/**
 * A collection of equations, which output in our proprietary Expression format.
 *
 * @returns {React.Component} An equations component.
 */
export const Equations = ({className, style, json}) => (
    <div className={className} style={style}>
        <p>{JSON.stringify(json)}</p>
    </div>
);

Equations.propTypes = {
    className: PropTypes.string.isRequired,
    style:     PropTypes.object.isRequired,
    json:      PropTypes.object.isRequired
};
