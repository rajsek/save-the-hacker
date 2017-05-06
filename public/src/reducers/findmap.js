import {MAP_MARKER, CHANGE_INFO_WINDOW, SELECTED, FAILED, LOADQUESTION, ADDNEWMARKER} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({lat: 27.1733511, lng: 78.042109, clicked: 3, won: false, question: '', markers:[], start:{},zoom:14}), action) {
    switch (action.type) {
        case SELECTED:
            {
                return getNewState(state, {won: true})
            }
        case FAILED:
            {
                return getNewState(state, {
                    clicked: state.get('clicked') - 1
                })
            }
        case ADDNEWMARKER: {

                return getNewState(state, {markers: state.get('markers').push({
                    lat: action.lat,
                    lng: action.lng,
                    id:state.get('clicked')})
                });
        }
        case LOADQUESTION:
            {
                return getNewState(state, {
                    lat: action.lat,
                    lng: action.lng,
                    start:action.start,
                    zoom:action.zoom,
                    clicked: 3,
                    won: false,
                    question: action.question
                })
            }
    }
    return state;
}
