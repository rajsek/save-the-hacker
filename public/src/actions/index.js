import {
    SAMPLE_ACTION,
} from './actionTypes';
import cookies from 'cookie-jeep';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function sampleAction(locale) {
    return dispatch => {
        dispatch({ type: SAMPLE_ACTION, locale: locale })
    }
}