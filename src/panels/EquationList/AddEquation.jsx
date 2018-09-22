import PropTypes from 'prop-types';
import React from 'react';

export const AddEquation = ({onAddEquation}) => {
    return (
        <div id="add-equation" onClick={onAddEquation}>
            <img src="./res/icon-add.svg" />
        </div>
    );
};

AddEquation.propTypes = {
    onAddEquation: PropTypes.func.isRequired
};
