import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {generate} from 'shortid';

import {Panel} from './';
import {Divider} from '../panels';

export const Rows = ({panelStyle, properties}) => (
    <div className="rows" style={panelStyle}>
        {properties.rows.map(row => (
            <Fragment key={generate()}>
                <Panel
                    type={row.type}
                    panelStyle={row.style}
                    properties={row.properties}
                />
                <Divider direction="vertical" />
            </Fragment>
        ))}
    </div>
);

Rows.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
