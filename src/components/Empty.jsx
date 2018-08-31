import PropTypes from 'prop-types';
import React from 'react';

export const Empty = ({properties}) => (
    <div style={{flexGrow: properties.size}} />
);

Empty.propTypes = {
    properties: PropTypes.object.isRequired
};
