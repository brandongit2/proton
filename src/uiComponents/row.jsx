import * as PropTypes from 'prop-types';
import * as React from 'react';
import {generate} from 'shortid';

import {Divider, Panel} from './index';

export class Row extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.createInitialState();

        this.onChildMove = this.onChildMove.bind(this);
    }

    createInitialState() {
        let initialState = {
            childWidths: {}, // Maps child IDs to their widths.
            idList:      []  // Stores the order of the IDs.
        };

        for (let panel of this.props.panels) {
            const id1 = generate(); // For the panel.
            const id2 = generate(); // For the divider.

            initialState.idList.push(id1, id2);

            initialState.childWidths[id1] = panel.width;
        }

        return initialState;
    }

    getPreviousPanelId(id) {
        return this.state.idList[this.state.idList.findIndex(element => id === element) - 1];
    }

    getNextPanelId(id) {
        return this.state.idList[this.state.idList.findIndex(element => id === element) + 1];
    }

    onChildMove(id, mouseDelta) {
        this.setState({
            childWidths: {
                ...this.state.childWidths,
                [this.getPreviousPanelId(id)]: this.state.childWidths[id] + mouseDelta,
                [this.getNextPanelId(id)]:     this.state.childWidths[id] - mouseDelta
            }
        });
    }

    render() {
        const {style, panels} = this.props;

        return (
            <div style={style} className="row">
                {panels.map(
                    panel => {
                        let iterateIds = 0;
                        console.log(this.state);

                        return (
                            <React.Fragment key={generate()}>
                                <Panel
                                    id={this.state.idList[iterateIds]}
                                    type={panel.type}
                                    width={this.state.childWidths[this.state.idList[iterateIds++]]}
                                    json={panel}
                                />
                                <Divider
                                    id={this.state.idList[iterateIds++]}
                                    className="divider vertical"
                                    onMove={this.onChildMove}
                                />
                            </React.Fragment>
                        );
                    }
                )}
            </div>
        );
    }
}

Row.propTypes = {
    style:  PropTypes.object.isRequired,
    id:     PropTypes.number.isRequired,
    panels: PropTypes.array.isRequired
};
