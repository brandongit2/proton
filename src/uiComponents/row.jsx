import * as PropTypes from 'prop-types';
import * as React from 'react';

import {Panel} from './index';

export const Row = ({height, panels}) => (
    <div className="row" style={{height: `${height}vh`}}>
        {panels.map(
            panel => (
                <Panel
                    key={window.panelCount++}
                    type={panel.type}
                    width={panel.width}
                    json={panel}
                />
            )
        )}
    </div>
);

Row.propTypes = {
    height: PropTypes.number.isRequired,
    panels: PropTypes.array.isRequired
};
