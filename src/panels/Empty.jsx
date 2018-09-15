import PropTypes from 'prop-types';
import React from 'react';

export const Empty = ({panelStyle, properties}) => (
    <div className="panel empty" style={panelStyle} />
);

Empty.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
