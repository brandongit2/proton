export const hydrateUI = json => ({
    type: 'HYDRATE_UI',
    json
});

export const resizePanel = (
    indexOfPanelBefore,
    indexOfPanelAfter,
    direction,
    path,
    mouseDelta
) => ({
    type: 'RESIZE_PANEL',
    direction,
    indexOfPanelBefore,
    indexOfPanelAfter,
    path,
    mouseDelta
});

export const addEquation = id => ({
    type: 'ADD_EQUATION',
    id
});

export const changeEquation = (id, value) => ({
    type: 'CHANGE_EQUATION',
    id,
    value
});

export const moveCaret = (id, position) => ({
    type: 'MOVE_CARET',
    id,
    position
});
