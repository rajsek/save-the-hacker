import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

class Header extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
    }

    render() {

        return (
            <header>
                <a className="appLogo" title="Explore the world">Explore the world</a>
            </header>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const nb_finished = state.getIn(['home', 'nb_finished']);
    return {
        nb_finished: nb_finished
    }
}
//This all fuzzz is because we need injecting react-intl
export default compose(connect(mapStateToProps, null, null, { pure: false })
)(Header);
