import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {generate} from 'shortid';

import {addEquation, changeEquation} from '../../actions';
import {AddEquation} from './AddEquation';
import {EquationItem} from './EquationItem';

export class EquationList extends React.Component {
    constructor(props) {
        super(props);
        this.onChildBlur = this.onChildBlur.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    onChildBlur() {
        this.forceUpdate();
    }

    render() {
        let {dispatch, panelStyle, properties, equations} = this.props;

        return (
            <div className="panel equationList" style={panelStyle}>
                {Object.keys(equations).map(id => {
                    console.log(equations, id, equations.id);
                    return (
                        <EquationItem
                            key={generate()}
                            onEquationChange={value => {
                                dispatch(changeEquation(id, value));
                            }}
                            onChildBlur={this.onChildBlur}
                            value={equations[id]}
                        />
                    );
                })}
                <AddEquation onAddEquation={() => {
                    dispatch(addEquation(generate()));
                    this.forceUpdate();
                }} /> {/* eslint-disable-line */}
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
