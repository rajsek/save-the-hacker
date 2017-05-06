import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import Header from './Header';

import {
    defineMessages,
    FormattedMessage,
    FormattedDate,
    injectIntl,
    intlShape
} from 'react-intl';

const labels = defineMessages({
    modal_nav_manifesto: {
        id: 'modal_nav_manifesto',
        defaultMessage: 'Manifesto'
    }
});

class Continent extends Component {
    render() {
        const {formatMessage} = this.props.intl;

        const style_hide = {
            display: 'none'
        };

        const style_show = {
            display: 'block'
        };

        return (
            <div className="page menuPage">
                <Header />
                <h1>Continent {this.props.continent}</h1>
            </div>
        );
    }
}

Continent.propTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);

function mapStateToProps(state, ownProps) {
    //const locale = state.getIn(['home', 'locale']);

    return {
        continent: ownProps.params.continent ? ownProps.params.continent : 'Asia'
    }
}

//This all fuzzz is beacuse we need injecting react-intl
export default compose(injectIntlDecorator(),
    connect(mapStateToProps, actions, null, { pure: false })
)(Continent);
