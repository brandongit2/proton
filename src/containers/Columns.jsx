import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {generate} from 'shortid';

import {Panel} from './';
import {Divider} from '../panels';

export const Columns = ({panelStyle, properties}) => (
    <div className="columns" style={panelStyle}>
        {properties.columns.map(column => (
            <Fragment key={generate()}>
                <Panel
                    type={column.type}
                    panelStyle={column.style}
                    properties={column.properties}
                />
                <Divider direction="horizontal" />
            </Fragment>
        ))}
    </div>
);

Columns.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
