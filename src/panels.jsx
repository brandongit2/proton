import * as React from 'react';

interface IPanel {
    width: number
}

export interface IToolbar extends IPanel {
    type: 'toolbar'
}

export interface IEquations extends IPanel {
    type: 'equations',
    id: number,
    equations: {
        [key: number]: {}
    }
}

export interface IGraph extends IPanel {
    type: 'graph',
    input: number
}

const Panel = () => {
    return <div></div>;
};

export const Toolbar = () => {
    return <Panel></Panel>;
};

export const Equations = () => {
    return <Panel></Panel>;
};

export const Graph = () => {
    return <Panel></Panel>;
};
