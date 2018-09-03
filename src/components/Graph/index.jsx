import PropTypes from 'prop-types';
import React from 'react';

export const Graph = ({properties}) => (
    <div className="panel graph" style={{flexGrow: properties.size}}>
        graph
    </div>
);

Graph.propTypes = {
    properties: PropTypes.object.isRequired
};
