import PropTypes from 'prop-types';
import React from 'react';
import {generate} from 'shortid';

import {Column} from './Column';
import {Divider} from '../components';

function Row({height, columns}) {
    return (
        <div className="row" style={{flexGrow: height}}>
            {columns.map(column => (
                <React.Fragment key={generate()}>
                    <Column
                        type={column.type}
                        width={column.width}
                        json={column.properties}
                    />
                    <Divider direction="vertical" />
                </React.Fragment>
            ))}
        </div>
    );
}

Row.propTypes = {
    height:  PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired
};

export default Row;
