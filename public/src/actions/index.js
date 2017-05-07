import {
    CHANGE_INFO_WINDOW,
    MAP_MARKER,
    GET_STREET_VIEW,
    CHANGE_DISTANCE,
    ROTATE_SECOND,
    SELECTED,
    FAILED,
    LOADQUESTION,
    ADDNEWMARKER,
    FIND_STREET_VIEW,
    POV_CHANGE,
    LOAD_POSITION,
    LOAD_POV,
    MAKE_WIN,
    MAKE_LOSS,
    LOAD_PANO,
    SAVE_USER,
    SAVE_CHALLENGE
} from './actionTypes';
import markerJson from '../../../config/src/marker.json';
import Places from '../libraries/places';
import ContinentData from '../libraries/continent';
import cookies from 'cookie-jeep';
import axios from 'axios';
import { browserHistory } from 'react-router';
export function addNewMarker(position) {
    return dispatch => {
        dispatch({ type: ADDNEWMARKER, lat: position.lat(), lng: position.lng() })
    }
}
export function makeWin() {
    return dispatch => {
        dispatch({ type: MAKE_WIN })
    }
}
export function makeLoss() {
    return dispatch => {
        dispatch({ type: MAKE_LOSS })
    }
}
export function loadPosition(position) {
    return dispatch => {
        dispatch({ type: LOAD_POSITION, lat: position.lat(), lng: position.lng() })
    }
}
export function loadPov(pov) {
    return dispatch => {
        dispatch({ type: LOAD_POV, heading: pov.heading, pitch: pov.pitch })
    }
}
export function sampleAction(locale) {
    return dispatch => {
        dispatch({ type: SAMPLE_ACTION, locale: locale })
    }
}
export const getDistance = (metre) => {
    return dispatch => {
        dispatch({ type: CHANGE_DISTANCE, distance: metre });
    };
}
export const rotateSecond = () => {
    return dispatch => {
        dispatch({ type: ROTATE_SECOND });
    };
}
export const Selected = () => {
    return dispatch => {
        dispatch({ type: SELECTED });
    };
}
export const Failed = () => {
    return dispatch => {
        dispatch({ type: FAILED });
    };
}
export const LoadQuestion = (id) => {
    return dispatch => {
        markerJson.map((val) => {
            if (val.Objective != '' && val.Id == id) {
                var latlng = JSON.parse(JSON.stringify(eval('(' + val.Objective + ')')));
                console.log(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))));
                dispatch({
                    type: LOADQUESTION,
                    question: val.title,
                    lat: parseFloat(latlng.lat),
                    lng: parseFloat(latlng.lng),
                    start: {
                        lat: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat),
                        lng: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng)
                    },
                    zoom: JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).zoom,
                    clicked: 3,
                    won: false
                });
            }
        });

    };
}
export const loadPano = (pano) => {
    return dispatch => {
        dispatch({ type: LOAD_PANO, pano: pano })
    }
}
export const getStreetViewPlace = (id) => {
    return dispatch => {
        markerJson.map((val) => {
            if (val.Id == id) {
                var new_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat);
                var new_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng);
                var porno = [];
                var pornos = JSON.parse(JSON.stringify(eval('(' + val.Objective + ')'))).destinations;
                console.log(pornos);
                for (var i in pornos) {
                    var s = pornos[i];
                    porno.push({
                        id: i,
                        heading: {
                            min: s.heading.min,
                            max: s.heading.max
                        },
                        pitch: {
                            min: s.pitch.min,
                            max: s.pitch.max
                        },
                        lat:s.lat,
                        lng:s.lng
                    })
                };
                dispatch({
                    type: FIND_STREET_VIEW,
                    title: val.Title,
                    data: {
                        position: {
                            lat: new_lat,
                            lng: new_long
                        },
                        pov: {
                            heading: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).head),
                            pitch: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).pitch)
                        },
                        zoom: 1
                    },
                    porno: porno
                });

            }

        });
    };
}
export const getStreetViewData = (id) => {
    return dispatch => {
        markerJson.map((val) => {
            if (val.Id == id) {
                //console.log(typeof(val.Data));
                var new_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat);
                var new_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng);
                var my_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Objective + ')'))).lat);
                var my_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Objective + ')'))).lng);
                console.log(new_long);

                dispatch({
                    type: GET_STREET_VIEW,
                    data: {
                        position: {
                            lat: new_lat,
                            lng: new_long
                        },
                        pov: {
                            heading: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.head),
                            pitch: parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.pitch)
                        },
                        zoom: 1
                    },
                    latitude: my_lat,
                    longitude: my_long,
                    pov: {
                        heading: 75,
                        pitch: 0
                    },
                    time: JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).time
                });

            }
        });
    };
}
export const changeInfoWIndow = (id) => {
    return dispatch => {
        dispatch({ type: CHANGE_INFO_WINDOW, id: id });
    }
};

export function loadMapMarkers(continent) {
    var markers = [];
    for (var i in Places)
        if (i == continent) {
            for (var val in Places[i]) {
                markers.push({
                    lat: parseFloat(Places[i][val].lat),
                    lng: parseFloat(Places[i][val].lng),
                    id: val,
                    name: Places[i][val].title,
                    type: Places[i][val].type,
                    show: false
                });
            }
        };
    return dispatch => {
        dispatch({
            type: MAP_MARKER,
            markers: markers
        });
    };
};

export function saveUser(id, first_name, last_name) {
    return axios.post('/api/saveUser', { idFB: id, firstName: first_name, lastName: last_name }).then(res => { return true })

}
