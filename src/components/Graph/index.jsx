import PropTypes from 'prop-types';
import React from 'react';
import Point from './';

export class Graph extends React.Component {
    state = {
        properties: {
            topPoint:    null,
            bottomPoint: null,
            leftPoint:   null,
            rightPoint:  null
        }
    }

    render() {
        return (
            <div className="graph" style={{flexGrow: this.props.properties.size}}>
                <p>Graph</p>
            </div>
        );
    }
}

Graph.propTypes = {
    properties: PropTypes.object.isRequired
};
