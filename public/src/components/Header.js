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
                <div className="gameStatus">
                    <small>Challanges Completed</small>
                    <strong>1/15</strong>
                </div>
            </header>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
    }
}
//This all fuzzz is because we need injecting react-intl
export default compose(connect(mapStateToProps, null, null, { pure: false })
)(Header);
