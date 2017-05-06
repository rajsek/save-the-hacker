import {MAP_MARKER, CHANGE_INFO_WINDOW} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({markers: []}), action) {
    switch (action.type) {
        case MAP_MARKER:
            return getNewState(state, {markers: action.markers});
        case CHANGE_INFO_WINDOW:
            return getNewState(state, {
                markers: state
                    .get('markers')
                    .toJS()
                    .map((val) => {
                        if (action.id == val.id) {
                            val.show = (val.show)
                                ? false
                                : true;
                        }
                        return val;
                    })
            });
    }
    return state;
}
