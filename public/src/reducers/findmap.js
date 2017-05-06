import {MAP_MARKER, CHANGE_INFO_WINDOW, SELECTED, FAILED, LOADQUESTION} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
function getNewState(state, newState) {
    return state.merge(newState);
}
export default function (state = fromJS({lat: 27.1733511, lng: 78.042109, clicked: 3, won: false, question: ''}), action) {
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
        case LOADQUESTION:
            {
                return getNewState(state, {
                    lat: action.lat,
                    lng: action.lng,
                    clicked: 3,
                    won: false,
                    question: action.question
                })
            }
    }
    return state;
}
