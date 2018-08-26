import * as PropTypes from 'prop-types';
import * as React from 'react';

/**
 * A bar shown at the top of the window, with dropdowns to access more functions.
 *
 * @returns {React.Component} A toolbar component.
 */
export const Toolbar = ({className, style, json}) => (
    <div className={className} style={style}>
        <p>{JSON.stringify(json)}</p>
    </div>
);

Toolbar.propTypes = {
    className: PropTypes.string.isRequired,
    style:     PropTypes.object.isRequired,
    json:      PropTypes.object.isRequired
};
