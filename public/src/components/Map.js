import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import * as actions from '../actions';
import conf from '../conf';

import {
    Map,
    KmlLayer,
    DataLayer,
    Feature,
    InfoWindow,
    CustomOverlay,
    Marker,
    MapControl,
    SearchBox
} from 'google-react-maps';

import { defineMessages, FormattedMessage, FormattedDate, injectIntl, intlShape } from 'react-intl';
const labels = defineMessages({
    title: {
        id: 'home_title',
        defaultMessage: '<small>Title</strong>'
    },
    sub_title: {
        id: 'home_sub_title',
        defaultMessage: 'Hello World'
    }
});

class Maps extends Component {
    constructor(props) {
        super(props);
        console.log(props);

    }
    componentWillMount() { }
    componentDidMount() {
        this
            .props
            .loadMapMarkers(this.props.params.name);
    }
    showInfoWIndow(id) {
        this
            .props
            .changeInfoWIndow(id);
    }
    render() {
        const { formatMessage } = this.props.intl;
        var markers = this
            .props
            .mapData
            .get('markers');
        var styles = {style:        [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#a2daf2"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f7f1df"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#d0e3b4"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#bde6ab"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fbd3da"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffe15f"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#efd151"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "black"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#cfb2db"
                    }
                ]
            }
        ]};
        return (
            <div className="map">
                <Map
                    api-key='AIzaSyChUn8dD8m6b6S1s0owgwMe_wpBligP7mA'
                    onMount={(map, maps) => {
                        this.map = map;
                    }}
                    optionsConstructor={function (maps) {
                    Object.assign(this, {
                        zoom: 4,
                        mapTypeId: maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: maps.ControlPosition.LEFT_CENTER
                        },
                        keyboardShortcuts: true,
                        panControl: true,
                        panControlOptions: {
                            position: maps.ControlPosition.BOTTOM_RIGHT
                        },
                        mapTypeId: maps.MapTypeId.HYBRID,
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            position: maps.ControlPosition.LEFT_BOTTOM
                        },
                        fullscreenControlOptions: {
                            position: maps.ControlPosition.RIGHT_BOTTOM
                        },
                        scrollwheel: false,
                        draggable:false,
                        streetViewControl: false,
                        panControl: false,
                        disableDoubleClickZoom: true,
                        styles: styles,
                        fullscreenControl: true
                    });
                }}>
                    {markers.map((val) => <Marker
                        coords={{
                            lat: val.get('lat'),
                            lng: val.get('lng')
                        }}
                        onClick={() => {
                            this.showInfoWIndow(val.get('id'));
                        }}
                        key={val.get('id')}>
                        <InfoWindow
                            open={val.get('show')}
                            onCloseClick={() => {

                            this.showInfoWIndow(val.get('id'));
                        }}>
                            <div onClick={() => {

                                    if(val.get('type') == 'map') {
                                        this.props.router.push('/find-map/'+val.get('id'));
                                    } else if(val.get('type')  == 'time') {
                                        this.props.router.push('/street/'+val.get('id'));
                                    } else if(val.get('type') == 'picture') {
                                        this.props.router.push('/find-street/'+val.get('id'));
                                    }

                                }}>HI {val.get('name')}</div>

                        </InfoWindow>
                    </Marker>)}
                </Map>
            </div>
        );
    }
}
Maps.propTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);
function mapStateToProps(state, ownProps) {
    return {
        mapData: state.getIn(['mapData'])
    }
}
//This all fuzzz is because we need injecting react-intl export default export
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, { pure: false }))(Maps);
