import PropTypes from 'prop-types';
import React from 'react';

export const EquationList = ({properties}) => (
    <div className="equations" style={{flexGrow: properties.size}}>
        equations
    </div>
);

EquationList.propTypes = {
    properties: PropTypes.object.isRequired
};
