import PropTypes from 'prop-types';
import React from 'react';

export class EquationItem extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }

    componentDidUpdate() {
        this.input.value = this.props.value;
    }

    render() {
        let {onEquationChange, onChildBlur} = this.props;
        console.log('hiihihi');

        return (
            <input
                type="text"
                onChange={e => { onEquationChange(e.target.value); }}
                onBlur={onChildBlur}
                ref={this.input}
            />
        );
    }
}

EquationItem.propTypes = {
    onEquationChange: PropTypes.func.isRequired,
    onChildBlur:      PropTypes.func.isRequired,
    value:            PropTypes.string
};
