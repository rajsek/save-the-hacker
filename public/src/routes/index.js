import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from '../containers/App';
import Home from '../components/Home';
import Map from '../components/Map';
import Street from '../components/Street';
import FindMap from '../components/FindOnMap';
export default(
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="home" component={Home}/>
        <Route path="map" component={Map}/>
        <Route path="street" component={Street}/>
        <Route path="find-map" component={FindMap}/>
    </Route>
);
