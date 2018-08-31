import PropTypes from 'prop-types';
import React from 'react';

export const Toolbar = ({properties}) => (
    <div className="toolbar" style={{flexGrow: properties.size}}>
        toolbar
    </div>
);

Toolbar.propTypes = {
    properties: PropTypes.object.isRequired
};
