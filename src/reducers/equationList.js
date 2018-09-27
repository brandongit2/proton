function equationList(state = {}, action) {
    switch (action.type) {
        case 'ADD_EQUATION':
            return {
                ...state,
                [action.id]: {
                    curr:     '',
                    prev:     '',
                    caretPos: 0
                }
            };
        case 'CHANGE_EQUATION': {
            let tentativeState = {
                ...state,
                [action.id]: {
                    curr:     action.value,
                    prev:     state[action.id].curr,
                    caretPos: state[action.id].caretPos
                }
            };
            let equation = tentativeState[action.id];

            /* eslint-disable indent */
            let longerString =
                equation.curr.length > equation.prev.length
                ? equation.curr.length
                : equation.prev.length;
            /* eslint-enable indent */
            for (let i = 0; i < longerString; i++) {
                if (equation.curr.charAt(i) !== equation.prev.charAt(i)) {
                    if (equation.curr.substring(i + 1) === equation.prev.substring(i)) {
                        switch (equation.curr.charAt(i)) {
                            case '(':
                                tentativeState[action.id].curr += ')';
                        }
                    } else {
                        break;
                    }
                }
            }

            return tentativeState;
        }

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
