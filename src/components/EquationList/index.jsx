import PropTypes from 'prop-types';
import React from 'react';

import Expression from '../../Expression';

export class EquationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: ''
        };

        this.expression = new Expression('');

        this.handle = this.handle.bind(this);
    }

    handle(e) {
        this.expression.changeExpression(e.target.value);
        let result = this.expression.execute({x: 5});
        this.setState({result});
    }

    render() {
        return (
            <div className="panel equations" style={{flexGrow: this.props.properties.size}}>
                <input onChange={this.handle}></input>
                <p>{this.state.result}</p>
            </div>
        );
    }
}

EquationList.propTypes = {
    properties: PropTypes.object.isRequired
};
