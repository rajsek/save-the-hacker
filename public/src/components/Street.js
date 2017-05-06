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
    MapControl,
    SearchBox
} from 'google-react-maps';
import ReactStreetview from 'react-streetview';

import {defineMessages, FormattedMessage, FormattedDate, injectIntl, intlShape} from 'react-intl';
require('../../assets/style/main.less')

class Maps extends Component {
    constructor() {
        super();
        this.time = '';
    }
    componentWillMount() {}
    componentDidMount() {
        this
            .props
            .getStreetViewData();
        this.time = window.setInterval(() => {
            this
                .props
                .rotateSecond();
        }, 1000);
    }
    componentWillReceiveProps(nexProps) {
        if (nexProps.streetData.time <= 0 || nexProps.streetData.distance <= 10) {
            window.clearInterval(this.time);
        }

    }
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var deg2rad = this.deg2rad;
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        this
            .props
            .getDistance(parseInt(d * 1000));
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    render() {
        const {formatMessage} = this.props.intl;
        const googleMapsApiKey = 'AIzaSyChUn8dD8m6b6S1s0owgwMe_wpBligP7mA';
        console.log(this.props.streetData);
        const streetViewPanoramaOptions = this.props.streetData.data;
        return (
            <div className="map">
                <div
                    style={{
                    width: '800px',
                    height: '450px',
                    backgroundColor: '#eeeeee'
                }}>
                    <div>{parseInt(this.props.streetData.time / 60)}
                        M : {this.props.streetData.time % 60}
                        S
                    </div>
                    {(this.props.streetData.time > 0)
                        ? ((this.props.streetData.distance > 10)
                            ? ((this.props.streetData.distance > 100)
                                ? <div>
                                        You are more than 100 metres away
                                    </div>
                                : <div>
                                    You are more than {this.props.streetData.distance}
                                    metres away
                                </div>)
                            : <div>You won</div>)
                        : <div>You Lost</div>}
                    <ReactStreetview
                        onPositionChanged={position => {
                        console.log(position);
                        this.getDistanceFromLatLonInKm(position.lat(), position.lng(), this.props.streetData.latitude, this.props.streetData.longitude)
                    }}
                        apiKey={googleMapsApiKey}
                        streetViewPanoramaOptions={streetViewPanoramaOptions}
                        onPovChanged={pov => console.log(pov)}/>
                </div>

            </div>
        );
    }
}
Maps.propTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);
function mapStateToProps(state, ownProps) {
    console.log(state.getIn(['street']));
    return {
        streetData: state
            .getIn(['street'])
            .toJS()
    }
}
//This all fuzzz is because we need injecting react-intl export default export
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, {pure: false}))(Maps);
