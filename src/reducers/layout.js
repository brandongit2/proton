function layout(state = {}, action) {
    switch (action.type) {
        case 'HYDRATE_UI':
            state = action.json;
            break;
        case 'RESIZE_PANEL':
            console.log(action);
            break;
        default:
    }

    return state;
}

export default layout;
