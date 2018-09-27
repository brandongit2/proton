import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {addEquation, changeEquation, moveCaret} from '../../actions';
import {AddEquation} from './AddEquation';
import {EquationItem} from './EquationItem';

export let EquationList = ({dispatch, panelStyle, equations}) => (
    <div className="panel equationList" style={panelStyle}>
        <AddEquation onAddEquation={() => {
            dispatch(addEquation(generate()));
        }} /> {/* eslint-disable-line */}
        <div>
            {Object.keys(equations).map(id => {
                return (
                    <EquationItem
                        key={generate()}
                        changeEquation={value => {
                            dispatch(changeEquation(id, value));
                        }}
                        moveCaret={position => {
                            dispatch(moveCaret(id, position));
                        }}
                        value={equations[id]}
                    />
                );
            })}
        </div>
    </div>
);

EquationList.propTypes = {
    dispatch:   PropTypes.func.isRequired,
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    equations:  PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    equations: state.equations
});

// eslint-disable-next-line no-class-assign
EquationList = connect(mapStateToProps)(EquationList);
