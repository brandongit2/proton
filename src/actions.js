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
