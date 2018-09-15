import PropTypes from 'prop-types';
import React from 'react';

export const Text = ({panelStyle, properties}) => (
    <div className="panel text" style={panelStyle}>
        {properties.text}
    </div>
);

Text.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
