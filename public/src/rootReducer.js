import {combineReducers} from 'redux-immutable';
import {reducer as form} from 'redux-form/immutable' // <--- immutable import
import Immutable from 'immutable';
import routerReducer from './routerReducer'
import homeReducer from './reducers/index';
import mapReducer from './reducers/map';
import streetReducer from './reducers/street';
import findStreetReducer from './reducers/findStreet';
import findmapReducer from './reducers/findmap';
/**
    * Combine multiple reducers
*/
const rootReducer = combineReducers({
    home: homeReducer,
    street: streetReducer,
    findmap: findmapReducer,
    mapData: mapReducer,
    findstreet:findStreetReducer,
    form: form,
    routing: routerReducer
});

export default rootReducer;
