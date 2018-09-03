import PropTypes from 'prop-types';
import React from 'react';

export class Divider extends React.Component {
    constructor(props) {
        super(props);
        this.element = React.createRef();
    }

    render() {
        return (
            <div
                ref={this.element}
                className={`divider ${this.props.direction}`}
            />
        );
    }
}

Divider.propTypes = {
    direction: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
};
