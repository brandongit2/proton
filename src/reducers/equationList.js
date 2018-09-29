function rawToKatex(raw) {
    return raw;
}

function equationList(state = {}, action) {
    switch (action.type) {
        case 'ADD_EQUATION':
            return {
                ...state,
                [action.id]: {
                    raw:      '',
                    katex:    '',
                    caretPos: 0
                }
            };
        case 'ADD_TO_EQAUTION': {
            let caretPos = state[action.id].caretPos;
            let newValue =
                state[action.id].raw.substring(0, caretPos)
                + action.chars
                + state[action.id].raw.substring(caretPos);
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    raw:   newValue,
                    katex: rawToKatex(newValue)
                }
            };
        }
        case 'BACKSPACE': {
            let caretPos = state[action.id].caretPos;
            let newValue =
                state[action.id].raw.substring(0, caretPos - action.numChars)
                + state[action.id].raw.substring(caretPos);
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    raw:   newValue,
                    katex: rawToKatex(newValue)
                }
            };
        }
        case 'FOCUS_EQUATION':
            return {
                ...state,
                focused: action.id
            };
        case 'MOVE_CARET':
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    caretPos: action.position
                }
            };
    }

    return state;
}

export default equationList;
