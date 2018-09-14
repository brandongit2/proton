import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {generate} from 'shortid';

import {Panel} from './';
import {Divider} from '../panels';

export const Rows = ({properties}) => (
    <div className="rows" style={{flexGrow: properties.size}}>
        {properties.rows.map(row => (
            <Fragment key={generate()}>
                <Panel
                    type={row.type}
                    properties={row.properties}
                />
                <Divider direction="vertical" />
            </Fragment>
        ))}
    </div>
);

Rows.propTypes = {
    properties: PropTypes.object.isRequired
};
