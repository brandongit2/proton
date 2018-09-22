import PropTypes from 'prop-types';
import React from 'react';

export class EquationItem extends React.Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    componentDidMount() {
        this.input.current.value = this.props.value;
    }

    render() {
        let {onEquationChange, onChildBlur} = this.props;
        return (
            <div className="equation-item">
                <input
                    type="text"
                    onChange={e => { onEquationChange(e.target.value); }}
                    onBlur={onChildBlur}
                    ref={this.input}
                />
            </div>
        );
    }
}

EquationItem.propTypes = {
    onEquationChange: PropTypes.func.isRequired,
    onChildBlur:      PropTypes.func.isRequired,
    value:            PropTypes.string.isRequired
};
