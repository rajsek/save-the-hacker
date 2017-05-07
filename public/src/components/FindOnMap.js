import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import * as actions from '../actions';
import conf from '../conf';
import Header from './Header';
import { browserHistory } from 'react-router';

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

class FindOnMap extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() { }
    componentDidMount() {
        this
            .props
            .LoadQuestion(this.props.params.id);
    }
    showInfoWIndow(id) {
        this
            .props
            .changeInfoWIndow(id);
    }

    goToGlobe(){
        browserHistory.push('/home');
    }

    goToContinent(){
        browserHistory.goBack();
    }

    showInfoBox(){
        document.querySelector('.infoBox').style.display = 'block';
    }

    hideInfoBox(){
        document.querySelector('.infoBox').style.display = 'none';
    }

    render() {
        const { formatMessage } = this.props.intl;

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
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2293df"
                    }
                ]
            }
        ];
        return (
            <div className="page mapPage findMap">
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
                        style={styles}
                        zoom={this.props.mapData.zoom}
                        optionsConstructor={function (maps) {
                        Object.assign(this, {
                            disableDefaultUI: true,
                            zoomControl: true,
                            zoomControlOptions: {
                                position: maps.ControlPosition.LEFT_CENTER
                            },
                            styles: styles,
                            keyboardShortcuts: true,
                            panControlOptions: {
                                position: maps.ControlPosition.BOTTOM_RIGHT
                            },
                            scrollwheel: false,
                            draggable:true,
                            streetViewControl: false,
                            panControl: false,
                            disableDoubleClickZoom: true,
                            fullscreenControl: false
                        });
                    }}
                        onClick={(position) => {
                        if (this.props.mapData.clicked > 0) {
                            this.props.addNewMarker(position.latLng);
                            this
                                .props
                                .Failed();
                        }
                    }}>

                        <Circle
                            radius={5000}
                            fillColor='#FF0000'
                            strokeColor='#FF0000'
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
                    <div className="challangeInfo ciLocate">
                        <figure></figure>
                        <h3><span>{this.props.mapData.question} ?</span></h3>
                    </div>
                </div>
                <Header />
                <div className="infoBlock">
                    <button title="Info" onClick={this.showInfoBox.bind(this)}></button>
                    <div className="infoBox">
                        <a className="close" onClick={this.hideInfoBox.bind(this)}>&times;</a>
                        <p>Surf around map and reach the mentioned destination. Once you reached there, click on the location !!</p>
                    </div>
                </div>

                <div className={(this.props.mapData.won || this.props.mapData.clicked <= 0) ? 'popup dialogResult ' : 'popup dialogResult hide' } id="result_popup" role="dialog">
                    <div className="popupOverlay"></div>
                    <div className="popupContent">
                        <a className="close" title="close">&times;</a>
                        <main>
                            {(this.props.mapData.clicked <= 0) ?
                                <div className="lost"><h3>Sorry! You lost!!</h3><p>Seems you need more information to this place. <a href="#">Explore more</a> about this place</p></div>

                            : ((this.props.mapData.won) ?
                                <div className="won"><h3>Awesome! You won!!</h3><p>You are seems a familier person to this place. <a href="#">Explore more</a> about this place</p></div>
                            : <p>'You have won the Challenge'</p>)}
                        </main>
                        <div className="actions">
                            <a role="button" className="btnGlobe" onClick={this.goToGlobe.bind(this)}><i></i> <span>Goto Globe</span></a>
                            <a role="button" className="btnContinet" onClick={this.goToContinent.bind(this)}><i></i> <span>Goto Continent</span></a>
                        </div>
                    </div>
                </div>
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
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, { pure: false }))(FindOnMap);
