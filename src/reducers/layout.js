function layout(state = {}, action) {
    switch (action.type) {
        case 'HYDRATE_UI':
            state = action.json.panels;
            break;
        default:
    }

    return state;
}

export default layout;
