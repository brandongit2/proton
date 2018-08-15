import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as Components from './index';

/**
 * A unit of the UI, somewhat analagous to windows.
 *
 * @returns {React.Component} A panel component.
 */
export const Panel = ({type, width, json}) => {
    let PanelType;
    switch (type) {
        case 'equations':
            PanelType = Components.Equations;
            break;
        case 'graph':
            PanelType = Components.Graph;
            break;
        case 'toolbar':
            PanelType = Components.Toolbar;
            break;
    }
    return <PanelType className="panel" style={{width: `${width}vw`}} json={json} />;
};

Panel.propTypes = {
    type:  PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    json:  PropTypes.object.isRequired
};
