import {createStore} from 'redux';

import rootReducer from './reducers';

let store = createStore(
    rootReducer,
    {
        layout: {
            'root-panel': {
                type:  'columns',
                style: {
                    flexGrow: 100
                },
                properties: {
                    columns: [
                        {
                            type:  'empty',
                            style: {
                                flexGrow: 100
                            },
                            properties: {}
                        }
                    ]
                }
            }
        },
        equations: {
            focused: ''
        }
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

if (module.hot) {
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
