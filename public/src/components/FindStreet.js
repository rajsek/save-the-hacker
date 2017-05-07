import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import curryRight from 'lodash.curryright';
import * as actions from '../actions';
import { browserHistory } from 'react-router';
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
import ReactStreetview from '../libraries/streetView';

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
            .getStreetViewPlace(this.props.params.id);
    }
    componentWillReceiveProps(nexProps) {


    }
    checkPlaceSatisfied() {
        var id = 0;
        console.log(this.props.streetData.pano);
        this.props.streetData.porno.map((val) => {
            if(val.id == this.props.streetData.pano) {
                id = 1;
                return this.props.enableCamera();
            }
        });
        if(id == 0) {
            return this.props.disableCamera();
        }

    }
    checkPlaceisRight() {
        var id = 0;
        this.props.streetData.porno.map((val) => {
            if(val.id == this.props.streetData.pano) {
                var headings = {min: val.heading.min, max: val.heading.max, current: this.props.streetData.heading};
                for(var i in headings)
                {
                    //"Clean" values in order to have the range [-180, 180]
                    if(headings[i] < -180)
                        headings[i] += 360;
                    else if(headings[i] > 180)
                        headings[i] -= 360;
                }

                var heading_wideness_max = 15,
                heading_wideness = Math.abs(headings.max - headings.min);

                if (heading_wideness < heading_wideness_max)
                {
                    headings.min -= (heading_wideness_max - heading_wideness) * .5;
                    headings.max += (heading_wideness_max - heading_wideness) * .5;
                }
                console.log('1 Passed')
                if(headings.min <= headings.current && headings.max >= headings.current) {
                    console.log('2 Passed')
                    if(val.pitch.min <= this.props.streetData.pitch && val.pitch.max >= this.props.streetData.pitch) {
                        console.log('3 Passed');
                        id = 1;
                        return this.props.makeWin();
                    }
                }
            }
        });
        if(id == 0) {
            return this.props.makeLoss();
        }
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
        var hide = (this.props.streetData.win || this.props.streetData.failed) ? '' : 'hide';
        const streetViewPanoramaOptions = this.props.streetData.data;
        return (
            <div className="page mapPage streetView">
                <div className="map">
                    <div>
                        <ReactStreetview
                            onPanoChanged={position => {
                                this.props.loadPano(position);
                                this.checkPlaceSatisfied();
                        }}
                            onPositionChanged={position => {
                                this.props.loadPosition(position);
                                this.checkPlaceSatisfied();
                        }}

                            panos={this.props.streetData.porno}
                            onLocationChanged={data => {}}
                            apiKey={googleMapsApiKey}
                            streetViewPanoramaOptions={streetViewPanoramaOptions}
                            onPovChanged={pov => { this.props.loadPov(pov);
                            this.checkPlaceSatisfied();}}/>
                    </div>
                    <div className="challangeInfo ciCamera">
                        <figure></figure>
                        <h3><span>Take a picture at Taj Mahal</span></h3>
                    </div>
                    <div className="gameProgress">
                        {(this.props.streetData.enabled) ? <button className="btnCapture" onClick={
                                    () => {
                                        this.checkPlaceisRight();
                                    }
                        }><i className="iconCamera"></i> <span>Capture</span></button> : <button className="btnCapture disabled" onClick={
                                    () => {

                                    }
                        }><i className="iconCamera"></i> <span>Capture</span></button>}
                    </div>
                </div>
                <Header />
                <div className="infoBlock">
                    <button title="Info"></button>
                    <div className="infoBox">
                        <a className="close">&times;</a>
                        <p>Surf around map and reach the mentioned destination. Once you reached the capture button will be enabled. Then take picture !!</p>
                    </div>
                </div>

                <div className={`popup dialogResult ${hide}`} id="result_popup" role="dialog">
                    <div className="popupOverlay"></div>
                    <div className="popupContent">
                        <a className="close" title="close" onClick={this.goToGlobe.bind(this)}>&times;</a>
                        <main>
                            {(this.props.streetData.win) ?
                                <div className="won"><h3>Awesome! You won!!</h3><p>You are seems a familier person to this place. <a href="#">Explore more</a> about this place</p></div>
                            : ((this.props.streetData.load) ?
                                <div className="lost"><h3>Sorry! You lost!!</h3><p>Seems you need more information to this place. <a href="#">Explore more</a> about this place</p></div>
                            : <div></div>)}
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
    return {
        streetData: state
            .getIn(['findstreet'])
            .toJS()
    }
}
//This all fuzzz is because we need injecting react-intl export default export
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, {pure: false}))(Maps);
