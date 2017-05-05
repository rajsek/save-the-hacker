import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import { browserHistory } from 'react-router';
import * as actions from '../actions';

import {
    defineMessages,
    FormattedMessage,
    FormattedDate,
    injectIntl,
    intlShape
} from 'react-intl';
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

class Home extends Component {
    constructor() {
        super();
    }
    render() {
        const { formatMessage } = this.props.intl;

        return (
            <div>
                <section className="section homeSection">
                    <div className="innerBlock">
                        <h1 dangerouslySetInnerHTML={{ __html: formatMessage(labels.title) }}></h1>
                        <p dangerouslySetInnerHTML={{ __html: formatMessage(labels.sub_title) }}></p>
                    </div>
                </section>
            </div>
        );
    }
}

Home.propTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);

function mapStateToProps(state, ownProps) {
    return {
    }
}
//This all fuzzz is because we need injecting react-intl
export default compose(injectIntlDecorator(),
    connect(mapStateToProps, actions, null, { pure: false })
)(Home);
