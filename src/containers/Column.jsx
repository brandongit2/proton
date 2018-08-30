import PropTypes from 'prop-types';
import React from 'react';

import {
    Empty,
    Equations,
    Graph,
    Toolbar
} from '../components';

export const Column = ({type, width, properties = {}}) => {
    let column;

    switch (type) {
        case 'toolbar':
            column = <Toolbar properties={properties} />;
            break;
        case 'equations':
            column = <Equations properties={properties} />;
            break;
        case 'graph':
            column = <Graph properties={properties} />;
            break;
        default:
            column = <Empty properties={properties} />;
    }

    return (
        <div className="column" style={{flexGrow: width}}>
            {column}
        </div>
    );
};

Column.propTypes = {
    type:       PropTypes.string.isRequired,
    width:      PropTypes.number.isRequired,
    properties: PropTypes.object
};
