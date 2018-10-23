import PropTypes from 'prop-types';
import React from 'react';

export const AddEquation = ({onAddEquation}) => {
    return (
        <div id="add-equation" onClick={onAddEquation}>
            <div id="line-top" />
            <div className="line" />
            <img src="./res/icon-add.svg" />
        </div>
    );
};

AddEquation.propTypes = {
    onAddEquation: PropTypes.func.isRequired
};
