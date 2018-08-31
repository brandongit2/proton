import PropTypes from 'prop-types';
import React from 'react';

export const Text = ({properties}) => (
    <div style={{flexGrow: properties.size}}>
        {properties.text}
    </div>
);

Text.propTypes = {
    properties: PropTypes.object.isRequired
};
