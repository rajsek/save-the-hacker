import {GET_STREET_VIEW, CHANGE_DISTANCE, ROTATE_SECOND} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({data: {}, distance: 100}), action) {
    switch (action.type) {
        case GET_STREET_VIEW:
            return getNewState(state, {
                data: action.data,
                latitude: action.latitude,
                longitude: action.longitude,
                time: action.time
            });
        case ROTATE_SECOND:
            return getNewState(state, {
                time: state.get('time') - 1
            });
        case CHANGE_DISTANCE:
            return getNewState(state, {distance: action.distance});

    }
    return state;
}
