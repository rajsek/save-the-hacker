import {POV_CHANGE, FIND_STREET_VIEW, LOAD_POV, LOAD_POSITION, MAKE_WIN, MAKE_LOSS, LOAD_PANO, MAKE_DISABLED, MAKE_ENABLED,SHOW_FRAME, HIDE_FRAME} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({data: {}, porno:[], frame:false, distance: 100}), action) {
    switch (action.type) {
        case POV_CHANGE:
            return getNewState(state, {distance: action.distance});
        case FIND_STREET_VIEW:
            return getNewState(state, {
                data: action.data,
                porno: action.porno,
                lat:27.1733511,
                enabled:0,
                title:action.title,
                pano:0,
                lng:78.042109,
                heading:72,
                pitch:0,
                win:false,
                frame:false,
                failed:false,
                load:0
            });
        case MAKE_ENABLED: {
            return getNewState(state, {
                enabled:1
            });
        }
        case MAKE_DISABLED: {
            return getNewState(state, {
                enabled:0
            });
        }
        case MAKE_LOSS:
            return getNewState(state, {
                win:false,
                failed:true,
                load:1
            });
        case SHOW_FRAME:{
            return getNewState(state, {
                frame:true
            });
        }
        case HIDE_FRAME:{
            return getNewState(state, {
                frame:false
            });
        }
        case MAKE_WIN:
            return getNewState(state, {
                win:true,
                failed:false,
                load:1
            });
        case LOAD_POV:
            return getNewState(state, {
                heading:action.heading,
                pitch:action.pitch
            });
        case LOAD_PANO:
            return getNewState(state, {
                pano:action.pano
            });
        case LOAD_POSITION:
            return getNewState(state, {
                lat:action.lat,
                lng:action.lng
            });

    }
    return state;
}
