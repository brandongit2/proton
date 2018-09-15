import PropTypes from 'prop-types';
import React from 'react';

export const Toolbar = ({panelStyle, properties}) => (
    <div className="panel toolbar" style={panelStyle}>
        <img className="toolbar__logo" src="../../res/logo-full.svg" />
    </div>
);

Toolbar.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
