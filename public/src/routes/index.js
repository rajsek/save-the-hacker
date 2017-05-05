import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../containers/App';
import Home from '../components/Home';
import Continent from '../components/Continent';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="home" component={Home} />
        <Route path="continent(/:continent)" component={Continent} />
    </Route>
);
