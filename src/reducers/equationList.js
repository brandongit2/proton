function equationList(state = {}, action) {
    switch (action.type) {
        case 'ADD_EQUATION':
            return {
                ...state,
                [action.id]: ''
            };
        case 'CHANGE_EQUATION':
            return {
                ...state,
                [action.id]: action.value
            };
    }

    return state;
}

export default equationList;
