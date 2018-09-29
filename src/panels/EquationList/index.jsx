import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {
    addEquation,
    addToEquation,
    backspace,
    focusEquation,
    moveCaret
} from '../../actions';
import {AddEquation} from './AddEquation';
import {EquationItem} from './EquationItem';

export let EquationList = ({dispatch, panelStyle, equations}) => {
    let equationNumber = 0;
    return (
        <div className="panel equationList" style={panelStyle}>
            <AddEquation onAddEquation={() => {
                dispatch(addEquation(generate()));
            }} /> {/* eslint-disable-line */}
            <div id="list">
                {Object.keys(equations).map(id => {
                    if (id !== 'focused') {
                        return (
                            <EquationItem
                                tabIndex={equationNumber++}
                                key={generate()}
                                raw={equations[id].raw}
                                isFocused={equations.focused === id}
                                katex={equations[id].katex}
                                caretPos={equations[id].caretPos}
                                focus={() => {
                                    dispatch(focusEquation(id));
                                }}
                                addToEquation={equation => {
                                    dispatch(addToEquation(id, equation));
                                }}
                                backspace={numChars => {
                                    dispatch(backspace(id, numChars));
                                }}
                                moveCaret={pos => {
                                    dispatch(moveCaret(id, pos));
                                }}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

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
