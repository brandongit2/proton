import PropTypes from 'prop-types';
import React from 'react';

export const AddEquation = ({onAddEquation}) => {
    return <p onClick={onAddEquation}>Add an equation</p>;
};

AddEquation.propTypes = {
    onAddEquation: PropTypes.func.isRequired
};
