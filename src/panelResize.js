import {generate} from 'shortid';

export function createInitialState(panels, direction) {
    let initialState;
    if (direction === 'row') {
        initialState = {
            childHeights: {}, // Maps child IDs to their heights.
            idList:       []  // Stores the order of the IDs.
        };
    } else if (direction === 'panel') {
        initialState = {
            childWidths: {}, // Maps child IDs to their widths.
            idList:      []  // Stores the order of the IDs.
        };
    }

    for (let panel of panels) {
        const id1 = generate(); // For the row/panel.
        const id2 = generate(); // For the divider.

        initialState.idList.push(id1, id2);

        initialState.childWidths[id1] = direction === 'row' ? panel.height : panel.width;
    }

    return initialState;
}

export function onChildMove(id, mouseDelta) {
    const {childHeights, idList} = this.state;

    // Get previous and next row IDs.
    const prevRowId = idList[idList.findIndex(element => element === id) - 1];
    const nextRowId = idList[idList.findIndex(element => element === id) + 1];

    this.setState({
        childHeights: {
            ...childHeights,
            [prevRowId]: childHeights.prevRowId + mouseDelta,
            [nextRowId]: childHeights.nextRowId - mouseDelta
        }
    });
}
