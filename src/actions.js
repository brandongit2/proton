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

export const addToEquation = (id, chars) => ({
    type: 'ADD_TO_EQAUTION',
    id,
    chars
});

export const backspace = (id, numChars) => ({
    type: 'BACKSPACE',
    id,
    numChars
});

export const focusEquation = id => ({
    type: 'FOCUS_EQUATION',
    id
});

export const moveCaret = (id, position) => ({
    type: 'MOVE_CARET',
    id,
    position
});

export const deleteEquation = id => ({
    type: 'DELETE_EQUATION',
    id
});
