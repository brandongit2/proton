/*
 * Used for finding text width and height to position cursors.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {Katex} from '../../components';

export class DummyKatex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width:  0,
            height: 0
        };
    }

    get height() {
        return this.state.height;
    }

    get width() {
        return this.state.width;
    }

    render() {
        return (
            <div style={{display: 'none'}}>
                <Katex code={this.props.code} />
            </div>
        );
    }
}

DummyKatex.propTypes = {
    code: PropTypes.string.isRequired
};
