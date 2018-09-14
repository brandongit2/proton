function layout(state = {}, action) {
    switch (action.type) {
        case 'HYDRATE_UI':
            return action.json;
        case 'RESIZE_PANEL':
            console.log(action);
            break;
        default:
    }

    return state;
}

export default layout;
