import {POV_CHANGE, FIND_STREET_VIEW, LOAD_POV, LOAD_POSITION, MAKE_WIN, MAKE_LOSS, LOAD_PANO} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({data: {}, distance: 100}), action) {
    switch (action.type) {
        case POV_CHANGE:
            return getNewState(state, {distance: action.distance});
        case FIND_STREET_VIEW:
            return getNewState(state, {
                data: action.data,
                porno: action.porno,
                lat:27.1733511,
                title:action.title,
                pano:0,
                lng:78.042109,
                heading:72,
                pitch:0,
                win:false,
                load:0
            });
        case MAKE_LOSS:
            return getNewState(state, {
                win:false,
                load:1
            });
        case MAKE_WIN:
            return getNewState(state, {
                win:true,
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
