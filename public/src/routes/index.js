import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from '../containers/App';
import Home from '../components/Home';
import Map from '../components/Map';
import Street from '../components/Street';
import FindMap from '../components/FindOnMap';
import FindStreet from '../components/FindStreet';
export default(
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="home" component={Home}/>
        <Route path="map/:name" component={Map}/>
        <Route path="street/:id" component={Street}/>
        <Route path="find-map/:id" component={FindMap}/>
        <Route path="find-street/:id" component={FindStreet}/>
    </Route>
);
