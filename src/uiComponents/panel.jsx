import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
    Equations,
    Graph,
    Toolbar,
    EmptyPanel
} from './';

/**
 * A unit of the UI, somewhat analagous to windows.
 *
 * @returns {React.Component} A panel component.
 */
export const Panel = ({id, type, width, json, onMove}) => {
    let PanelType = EmptyPanel;
    switch (type) {
        case 'equations':
            PanelType = Equations;
            break;
        case 'graph':
            PanelType = Graph;
            break;
        case 'toolbar':
            PanelType = Toolbar;
            break;
    }
    return <PanelType className="panel" style={{flexGrow: `${width}`}} json={json} />;
};

Panel.propTypes = {
    id:     PropTypes.string.isRequired,
    type:   PropTypes.string.isRequired,
    width:  PropTypes.number.isRequired,
    json:   PropTypes.object.isRequired,
    onMove: PropTypes.func.isRequired
};
