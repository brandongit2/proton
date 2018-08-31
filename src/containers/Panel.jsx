import PropTypes from 'prop-types';
import React from 'react';

import {Rows, Columns} from './';
import {
    Empty,
    EquationList,
    Graph,
    Text,
    Toolbar
} from '../components';

export const Panel = ({type, properties}) => {
    let panel;
    switch (type) {
        case 'rows':
            panel = <Rows properties={properties} />;
            break;
        case 'columns':
            panel = <Columns properties={properties} />;
            break;
        case 'equation-list':
            panel = <EquationList properties={properties} />;
            break;
        case 'graph':
            panel = <Graph properties={properties} />;
            break;
        case 'text':
            panel = <Text properties={properties} />;
            break;
        case 'toolbar':
            panel = <Toolbar properties={properties} />;
            break;
        default:
            if (type !== 'empty') {
                console.warn(`Type ${type} is not a valid panel type.`);
            }
            panel = <Empty properties={properties} />;
    }

    return panel;
};

Panel.propTypes = {
    type:       PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired
};
