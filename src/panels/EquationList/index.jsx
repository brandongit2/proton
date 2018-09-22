import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {addEquation, changeEquation} from '../../actions';
import {AddEquation} from './AddEquation';
import {EquationItem} from './EquationItem';

export class EquationList extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        let {dispatch, panelStyle, equations} = this.props;
        return (
            <div className="panel equationList" style={panelStyle}>
                <AddEquation onAddEquation={() => {
                    dispatch(addEquation(generate()));
                    this.forceUpdate();
                }} /> {/* eslint-disable-line */}
                {Object.keys(equations).map(id => {
                    return (
                        <EquationItem
                            key={generate()}
                            onEquationChange={value => {
                                dispatch(changeEquation(id, value));
                            }}
                            onChildBlur={() => { this.forceUpdate(); }}
                            value={equations[id]}
                        />
                    );
                })}
            </div>
        );
    }
}

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
