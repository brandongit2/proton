import * as React from 'react';
// tslint:disable-next-line:no-implicit-dependencies
import {hot} from 'react-hot-loader';

import * as Panels from './panels';

const Row = () => (
    <div></div>
);

interface PanelJSON {
    json: {
        panels: {
            rows: {
                [key: number]: {
                    height: number,
                    panels: {
                        [key: number]: Panels.IToolbar | Panels.IEquations | Panels.IGraph
                    }
                }
            }
        }
    }
}

const App = hot(module)(({json}: PanelJSON) => {
    const rows = json.panels.rows;
    for (let row of rows) {
        console.log(row);
    }

    return <div></div>;
});
export default App;

// The space between panels.
const Divider = () => (
    <div></div>
);
