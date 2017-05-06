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
    constructor() {
        super();
    }
    componentWillMount() { }
    componentDidMount() {
        this
            .props
            .LoadQuestion();
    }
    showInfoWIndow(id) {
        this
            .props
            .changeInfoWIndow(id);
    }
    render() {
        const { formatMessage } = this.props.intl;
        console.log(this.props.mapData);
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
                    }}
                    onClick={(position) => {
                        if (this.props.mapData.clicked > 0) {
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
                                this
                                    .props
                                    .Selected();
                            }
                        }}></Circle>
                </Map>
                <span>{this.props.mapData.question}
                    ?
                    <br /></span>
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
export default compose(injectIntlDecorator(), connect(mapStateToProps, actions, null, { pure: false }))(FindOnMap);
