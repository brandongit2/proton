import PropTypes from 'prop-types';
import React from 'react';

import {Rows, Columns} from './';
import {
    Empty,
    EquationList,
    Graph,
    Text,
    Toolbar
} from '../panels';

export const Panel = ({type, panelStyle, properties}) => {
    let panel;
    switch (type) {
        case 'rows':
            panel = <Rows panelStyle={panelStyle} properties={properties} />;
            break;
        case 'columns':
            panel = <Columns panelStyle={panelStyle} properties={properties} />;
            break;
        case 'equation-list':
            panel = <EquationList panelStyle={panelStyle} properties={properties} />;
            break;
        case 'graph':
            panel = <Graph panelStyle={panelStyle} properties={properties} />;
            break;
        case 'text':
            panel = <Text panelStyle={panelStyle} properties={properties} />;
            break;
        case 'toolbar':
            panel = <Toolbar panelStyle={panelStyle} properties={properties} />;
            break;
        default:
            if (type !== 'empty') {
                console.warn(`${type} is not a valid panel type.`);
            }
            panel = <Empty panelStyle={panelStyle} properties={properties} />;
    }

    return panel;
};

Panel.propTypes = {
    type:       PropTypes.string.isRequired,
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
