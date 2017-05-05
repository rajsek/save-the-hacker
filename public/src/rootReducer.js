import { combineReducers } from 'redux-immutable';
import { reducer as form } from 'redux-form/immutable' // <--- immutable import
import Immutable from 'immutable';
import routerReducer from './routerReducer'
import homeReducer from './reducers/index';

/**
    * Combine multiple reducers
*/
const rootReducer = combineReducers({
    home: homeReducer,
    form: form,
    routing: routerReducer
});

export default rootReducer;
