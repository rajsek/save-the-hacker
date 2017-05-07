import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import curryRight from 'lodash.curryright';
import * as actions from '../actions';
import conf from '../conf';
import Header from './Header';
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

class Maps extends Component {
    constructor(props) {
        super(props);
        this.time = '';
    }
    componentWillMount() {}
    componentDidMount() {
        this
            .props
            .getStreetViewData(this.props.params.id);
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

    goToGlobe(){
        browserHistory.push('/home');
    }

    goToContinent(){
        browserHistory.goBack();
    }

    render() {
        const {formatMessage} = this.props.intl;
        const googleMapsApiKey = 'AIzaSyChUn8dD8m6b6S1s0owgwMe_wpBligP7mA';
        console.log(this.props.streetData);
        const streetViewPanoramaOptions = this.props.streetData.data;
        return (
            <div className="page mapPage streetView">
                <div className="map">
                    <ReactStreetview
                        onPositionChanged={position => {
                        console.log(position);
                        this.getDistanceFromLatLonInKm(position.lat(), position.lng(), this.props.streetData.latitude, this.props.streetData.longitude)
                    }}
                        apiKey={googleMapsApiKey}
                        onLocationChanged={data => console.log(data)}
                        streetViewPanoramaOptions={streetViewPanoramaOptions}
                        onPovChanged={pov => console.log(pov)}/>

                    <div className="gameProgress">
                        <div className="timer">
                            <h4>
                            {(this.props.streetData.time > 0)
                                ?
                                <span> You are {this.props.streetData.distance}
                                metres away </span> : <span></span>
                            }
                            </h4>
                            <div className="clock">
                                <div>
                                    <small>Mins</small>
                                    <span>{parseInt(this.props.streetData.time / 60)}</span>
                                </div>
                                <div>
                                    <small>Secs</small>
                                    <span>{this.props.streetData.time % 60}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Header />
                <div className="challangeInfo ciTime">
                    <figure></figure>
                    <h3><span>Connect place ?</span></h3>
                </div>
                <div className="infoBlock">
                    <button title="Info"></button>
                    <div className="infoBox">
                        <a className="close">&times;</a>
                        <p>Surf around map and reach the mentioned destination. Once you reached there, click on the location !!</p>
                    </div>
                </div>

                <div className={ this.props.streetData.time <= 0 || this.props.streetData.distance < 50 ? 'popup dialogResult hide' : 'popup dialogResult' } id="result_popup" role="dialog">
                    <div className="popupOverlay"></div>
                    <div className="popupContent">
                        <a className="close" title="close">&times;</a>
                        <main>
                            {(this.props.streetData.time > 0 && this.props.streetData.distance < 50) ?
                                <div className="won"><h3>Awesome! You won!!</h3><p>You are seems a familier person to this place. <a href="#">Explore more</a> about this place</p></div>
                            :
                                <div className="lost"><h3>Sorry! You lost!!</h3><p>Seems you need more information to this place. <a href="#">Explore more</a> about this place</p></div>
                            }
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
