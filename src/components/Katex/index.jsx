import katex from 'katex';
import React from 'react';
import PropTypes from 'prop-types';

export class Katex extends React.Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    componentDidMount() {
        if (typeof this.props.code !== 'undefined') {
            katex.render(this.props.code, this.input.current);
        }
    }

    render() {
        return (
            <div className="katex-component" ref={this.input} />
        );
    }
}

Katex.propTypes = {
    code: PropTypes.string
};
