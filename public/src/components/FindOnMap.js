import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
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
    Circle,
    SearchBox
} from 'google-react-maps';

import {defineMessages, FormattedMessage, FormattedDate, injectIntl, intlShape} from 'react-intl';
require('../../assets/style/main.less')
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

class FindOnMap extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {}
    componentDidMount() {
        console.log(this.props.params.id);
        this
            .props
            .LoadQuestion(this.props.params.id);
    }
    showInfoWIndow(id) {
        this
            .props
            .changeInfoWIndow(id);
    }
    render() {
        const {formatMessage} = this.props.intl;
        console.log(this.props.mapData);
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
                    center={{
                            lat:this.props.mapData.start.lat,
                            lng:this.props.mapData.start.lng
                        }}
                    zoom={this.props.mapData.zoom}
                    optionsConstructor={function (maps) {
                    Object.assign(this, {
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
                        draggable:true,
                        streetViewControl: false,
                        panControl: false,
                        disableDoubleClickZoom: true,
                        styles: styles,
                        fullscreenControl: true
                    });
                }}
                    onClick={(position) => {
                    if (this.props.mapData.clicked > 0) {
                        console.log(position);
                        this.props.addNewMarker(position.latLng);
                        this
                            .props
                            .Failed();
                    }
                }}>
                    <Circle
                        radius={5000}
                        fillColor='transparent'
                        strokeColor='transparent'
                        center={{
                        lat: this.props.mapData.lat,
                        lng: this.props.mapData.lng
                    }}
                        onClick={(position) => {
                        if (this.props.mapData.clicked > 0) {
                            this.props.addNewMarker(position.latLng);
                            this
                                .props
                                .Selected();
                        }
                    }}></Circle>
                        {this.props.mapData.markers.map((val) => <Marker
                            coords={{
                            lat: val.lat,
                            lng: val.lng
                        }}

                        key={val.id} onClick={() => {

                        }}>
                    </Marker>)}
                </Map>
                <span>{this.props.mapData.question}
                    ?
                    <br/></span>
                <span>{(this.props.mapData.clicked <= 0)
                        ? 'You Lost'
                        : ((this.props.mapData.won)
                            ? 'You Won'
                            : 'You have ' + this.props.mapData.clicked + 'chance to play')}
                </span>
            </div>
        );
    }
}
FindOnMap.propTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);
function mapStateToProps(state, ownProps) {
    return {
        mapData: state
            .getIn(['findmap'])
            .toJS()
    }
}
//This all fuzzz is because we need injecting react-intl export default export
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, {pure: false}))(FindOnMap);
