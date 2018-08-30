import {createStore} from 'redux';

import rootReducer from './reducers';

let store = createStore(
    rootReducer,
    {
        layout: {
            rows: [
                {
                    height:  100,
                    columns: [
                        {
                            type:       'empty',
                            width:      100
                        }
                    ]
                }
            ]
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
