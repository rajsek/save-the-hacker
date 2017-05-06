import {LOCALE_CHANGE, MAP_MARKER} from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
import cookies from 'cookie-jeep';

import conf from '../conf';

var locale = 'en_US';

function getNewState(state, newState) {
    return state.merge(newState);
}

export default function (state = fromJS({locale: locale}), action) {
    switch (action.type) {
        case LOCALE_CHANGE:
            return getNewState(state, {locale: action.locale});
    }
    return state;
}
