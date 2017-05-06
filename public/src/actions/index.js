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
    MAKE_LOSS
} from './actionTypes';
import markerJson from '../../../config/src/marker.json';
import cookies from 'cookie-jeep';
import axios from 'axios';
import {browserHistory} from 'react-router';
export function addNewMarker(position) {
    return dispatch => {
        dispatch({type:ADDNEWMARKER, lat: position.lat(), lng: position.lng()})
    }
}
export function makeWin() {
    return dispatch => {
        dispatch({type: MAKE_WIN})
    }
}
export function makeLoss() {
    return dispatch => {
        dispatch({type: MAKE_LOSS})
    }
}
export function loadPosition(position) {
    return dispatch => {
        dispatch({type: LOAD_POSITION, lat: position.lat(), lng:position.lng()})
    }
}
export function loadPov(pov) {
    console.log(pov);
    return dispatch => {
        dispatch({type: LOAD_POV, heading: pov.heading, pitch:pov.pitch})
    }
}
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
export const LoadQuestion = (id) => {
    return dispatch => {
        markerJson.map((val) => {
        if(val.Objective != '' && val.Id == id) {
            var latlng = JSON.parse(JSON.stringify(eval('(' + val.Objective + ')')));
            console.log(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))));
                dispatch({
                    type: LOADQUESTION,
                    question: val.title,
                    lat: parseFloat(latlng.lat),
                    lng: parseFloat(latlng.lng),
                    start:{
                        lat:parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat),
                        lng:parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng)
                    },
                    zoom:JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).zoom,
                    clicked: 3,
                    won: false
                });
        }
        });

    };
}
export const getStreetViewPlace = (id) => {
    markerJson.map((val) => {
        if(val.Id == id) {
            var my_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat);
            var my_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng);
            var new_lat = 27.1731146;
            var new_long = 78.0429197;
            return dispatch => {
                dispatch({
                    type: FIND_STREET_VIEW,
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
                    porno: [
                        {
                            id:parseFloat(my_lat).toFixed(2)+'_'+parseFloat(my_long).toFixed(2),
                            heading:{
                                min:70,
                                max:76
                            },
                            pitch: {
                                min:0,
                                max:1
                            }
                        }
                    ]
                });
            };
        }

    });
}
export const getStreetViewData = (id) => {
     markerJson.map((val) => {
        if(val.Id == id) {
            console.log(JSON.stringify(eval('(' + val.Data + ')')));
            var my_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lat);
            var my_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Data + ')'))).start.lng);
            var new_lat = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Objective + ')'))).lat);
            var new_long = parseFloat(JSON.parse(JSON.stringify(eval('(' + val.Objective + ')'))).lng);
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
     });
}
export const changeInfoWIndow = (id) => {
    return dispatch => {
        dispatch({type: CHANGE_INFO_WINDOW, id: id});
    }
};

export function loadMapMarkers(continent) {
    var markers = [];
    markerJson.map((val) => {
        console.log(val.Continent+(val.Continent == continent.replace('_',' ')));
        if(val.Objective != '' && val.Continent == continent.replace('_',' ')) {
            console.log(val);
            var latlng = JSON.parse(JSON.stringify(eval('(' + val.Objective + ')')));
            if(typeof(latlng.destinations) != 'undefined') {
                latlng = latlng.destinations;
            }
            //console.log(val.Id)
            //console.log(typeof(JSON.parse(JSON.stringify(eval('(' + latlng + ')')))));
            markers.push({
                    lat: parseFloat(latlng.lat),
                    lng: parseFloat(latlng.lng),
                    id: val.Id,
                    name: val.Title,
                    type:val.Type,
                    show: false
                });
        }

    });
    return dispatch => {
        dispatch({
            type: MAP_MARKER,
            markers: markers
        });
    };
};
