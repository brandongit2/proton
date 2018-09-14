import {combineReducers} from 'redux';
import layout from './layout';
import equationList from './equationList';

const rootReducer =  combineReducers({
    layout,
    equations: equationList
});

export default rootReducer;
