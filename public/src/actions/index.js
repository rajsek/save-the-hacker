import {
    CHANGE_INFO_WINDOW,
    MAP_MARKER,
    GET_STREET_VIEW,
    CHANGE_DISTANCE,
    ROTATE_SECOND,
    SELECTED,
    FAILED,
    LOADQUESTION
} from './actionTypes';
import cookies from 'cookie-jeep';
import axios from 'axios';
import {browserHistory} from 'react-router';

export function sampleAction(locale) {
    return dispatch => {
        dispatch({type: SAMPLE_ACTION, locale: locale})
    }
}
export const getDistance = (metre) => {
    return dispatch => {
        dispatch({type: CHANGE_DISTANCE, distance: metre});
    };
}
export const rotateSecond = () => {
    return dispatch => {
        dispatch({type: ROTATE_SECOND});
    };
}
export const Selected = () => {
    return dispatch => {
        dispatch({type: SELECTED});
    };
}
export const Failed = () => {
    return dispatch => {
        dispatch({type: FAILED});
    };
}
export const LoadQuestion = () => {
    return dispatch => {
        dispatch({
            type: LOADQUESTION,
            question: 'symbol of love in india',
            lat: 27.1733511,
            lng: 78.042109,
            clicked: 3,
            won: false
        });
    };
}
export const getStreetViewData = () => {
    var my_lat = 27.1733511;
    var my_long = 78.042109;
    var new_lat = 27.1731146;
    var new_long = 78.0429197;
    return dispatch => {
        dispatch({
            type: GET_STREET_VIEW,
            data: {
                position: {
                    lat: new_lat,
                    lng: new_long
                },
                pov: {
                    heading: 75,
                    pitch: 0
                },
                zoom: 1
            },
            latitude: my_lat,
            longitude: my_long,
            pov: {
                heading: 75,
                pitch: 0
            },
            time: 300
        });
    };
}
export const changeInfoWIndow = (id) => {
    return dispatch => {
        dispatch({type: CHANGE_INFO_WINDOW, id: id});
    }
};

export function loadMapMarkers() {
    return dispatch => {
        dispatch({
            type: MAP_MARKER,
            markers: [
                {
                    lat: 27.1750,
                    lng: 78.0422,
                    id: 1,
                    name: 'Taj Mahal',
                    show: false
                }, {
                    lat: 29.9792,
                    lng: 31.1342,
                    id: 2,
                    name: 'Pyramid',
                    show: false
                }, {
                    lat: 32.5422,
                    lng: 44.4210,
                    id: 3,
                    name: 'Hanging Gardens of Babylon',
                    show: false
                }, {
                    lat: 37.6379,
                    lng: 21.6303,
                    id: 4,
                    name: 'Temple of Zeus, Olympia',
                    show: false
                }, {
                    lat: 37.9499,
                    lng: 27.3634,
                    id: 5,
                    name: 'Temple of Artemis',
                    show: false
                }
            ]
        });
    }
}
