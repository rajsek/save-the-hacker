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

class Maps extends Component {
    constructor() {
        super();
    }
    componentWillMount() {}
    componentDidMount() {
        this
            .props
            .loadMapMarkers();
    }
    showInfoWIndow(id) {
        this
            .props
            .changeInfoWIndow(id);
    }
    render() {
        const {formatMessage} = this.props.intl;
        var markers = this
            .props
            .mapData
            .get('markers');
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
                            <div>HI {val.get('name')}</div>
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
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, {pure: false}))(Maps);
