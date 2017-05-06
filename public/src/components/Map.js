import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import * as actions from '../actions';
import ContinentData from '../libraries/continent';
import conf from '../conf';
import Header from './Header';


var icon_camera = require('../../assets/img/map/pin-camera.png'),
    icon_camera_completed = require('../../assets/img/map/pin-camera-played.png'),
    icon_locate = require('../../assets/img/map/pin-locate.png'),
    icon_locate_completed = require('../../assets/img/map/pin-locate-played.png'),
    icon_time = require('../../assets/img/map/pin-time.png'),
    icon_time_completed = require('../../assets/img/map/pin-time-played.png');

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

        var styles = [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#a1e262"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2293df"
                    }
                ]
            }
        ];

        var iconUrl = ('new' == 'new') ? icon_camera : icon_camera_completed;

        var configData = ContinentData[this.props.params.name];
        return (
            <div className="page mapPage continentPage">
                <div className="map">
                    <Map
                        api-key='AIzaSyChUn8dD8m6b6S1s0owgwMe_wpBligP7mA'
                        onMount={(map, maps) => {
                            this.map = map;
                        }}
                        center={{
                            lat:parseFloat(configData.center.lat),
                            lng:parseFloat(configData.center.lng)
                        }}
                        mapType="ROADMAP"
                        optionsConstructor={function (maps) {
                        Object.assign(this, {
                            zoom: parseInt(configData.zoom),
                            disableDefaultUI: true,
                            zoomControl: true,
                            zoomControlOptions: {
                                position: maps.ControlPosition.LEFT_CENTER
                            },
                            styles: styles,
                            keyboardShortcuts: true,
                            panControl: true,
                            panControlOptions: {
                                position: maps.ControlPosition.BOTTOM_RIGHT
                            },
                            fullscreenControlOptions: {
                                position: maps.ControlPosition.RIGHT_BOTTOM
                            },
                            scrollwheel: false,
                            draggable:false,
                            streetViewControl: false,
                            panControl: false,
                            disableDoubleClickZoom: true,
                            fullscreenControl: true
                        });
                    }}>
                        {markers.map((val) => <Marker
                            coords={{
                                lat: val.get('lat'),
                                lng: val.get('lng')
                            }}
                            icon={{
                                url: iconUrl
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
                                <div className={'selectChallange challange-' + val.get('id')} onClick={() => {

                                    if(val.get('type') == 'map') {
                                        this.props.router.push('/find-map/'+val.get('id'));
                                    } else if(val.get('type')  == 'time') {
                                        window.location.href = '/street/'+val.get('id');
                                        //this.props.router.push('/street/'+val.get('id'));
                                    } else if(val.get('type') == 'picture') {
                                        window.location.href = '/find-street/'+val.get('id');
                                        //this.props.router.push('/find-street/'+val.get('id'));
                                    }

                                    }}>
                                    <a className="close">&times;</a>
                                    <figure></figure>
                                    <h3>{val.get('name')}</h3>
                                    <button>Start challange</button>
                                </div>

                            </InfoWindow>
                        </Marker>)}
                    </Map>
                </div>
                <Header />
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
