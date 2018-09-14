import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {generate} from 'shortid';

import {Panel} from './';
import {Divider} from '../panels';

export const Columns = ({properties}) => (
    <div className="columns" style={{flexGrow: properties.size}}>
        {properties.columns.map(column => (
            <Fragment key={generate()}>
                <Panel
                    type={column.type}
                    properties={column.properties}
                />
                <Divider direction="horizontal" />
            </Fragment>
        ))}
    </div>
);

Columns.propTypes = {
    properties: PropTypes.object.isRequired
};

