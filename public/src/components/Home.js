import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import slugify from 'slugify';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import * as THREE from 'three';

import { initScene, getScene, getCamera, getRenderer, getControls } from '../libraries/scene';
import { setEvents } from '../libraries/setEvent';
import { convertToXYZ, getEventCenter, geodecoder } from '../libraries/geoHelpers';
import { mapTexture } from '../libraries/mapTexture';
import { getTween, memoize } from '../libraries/utils';
import * as topojson from 'topojson/build/topojson';

import d3 from 'd3';

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

    componentDidMount() {
        initScene();
        var scene = getScene();
        var renderer = getRenderer();
        var camera = getCamera();
        var controls = getControls();

        d3.json('../../assets/data/continent.json', function (err, data) {
            d3.select("#loading").transition().duration(500)
                .style("opacity", 0).remove();

            var currentContinent, overlay;

            var segments = 155; // number of vertices. Higher = better mouse accuracy

            // Setup cache for country textures
            var continents = topojson.feature(data, data.objects.collection);
            var geo = geodecoder(continents.features);

            var textureCache = memoize(function (continent_id, color) {
                var continent = geo.find(continent_id);
                return mapTexture(continent, color);
            });

            // Base globe with blue "water"
            let blueMaterial = new THREE.MeshPhongMaterial({ color: '#2293df', transparent: true });
            let sphere = new THREE.SphereGeometry(200, segments, segments);
            let baseGlobe = new THREE.Mesh(sphere, blueMaterial);
            baseGlobe.rotation.y = Math.PI;
            baseGlobe.addEventListener('click', onGlobeClick);
            baseGlobe.addEventListener('mousemove', onGlobeMousemove);

            // add base map layer with all continents
            let worldTexture = mapTexture(continents, '#a1e262');
            let mapMaterial = new THREE.MeshPhongMaterial({ map: worldTexture, transparent: true });
            var baseMap = new THREE.Mesh(new THREE.SphereGeometry(200, segments, segments), mapMaterial);
            baseMap.rotation.y = Math.PI;

            // create a container node and add the two meshes
            var root = new THREE.Object3D();
            root.scale.set(2.5, 2.5, 2.5);
            root.add(baseGlobe);
            root.add(baseMap);
            scene.add(root);

            var clickCount = 0;
            var singleClickTimer;

            function onGlobeClick(event) {
                clickCount++;
                if (clickCount === 1) {
                    singleClickTimer = setTimeout(function() {
                        clickCount = 0;
                    }, 400);
                } else if (clickCount === 2) {
                    clearTimeout(singleClickTimer);
                    clickCount = 0;
                    // Get pointc, convert to latitude/longitude
                    var latlng = getEventCenter.call(this, event);

                    var continent = geo.search(latlng[0], latlng[1]);


                    // Get new camera position
                    var temp = new THREE.Mesh();
                    temp.position.copy(convertToXYZ(latlng, 900));
                    temp.lookAt(root.position);
                    temp.rotateY(Math.PI);

                    for (let key in temp.rotation) {
                        if (temp.rotation[key] - camera.rotation[key] > Math.PI) {
                            temp.rotation[key] -= Math.PI * 2;
                        } else if (camera.rotation[key] - temp.rotation[key] > Math.PI) {
                            temp.rotation[key] += Math.PI * 2;
                        }
                    }

                    var tweenPos = getTween.call(camera, 'position', temp.position);
                    d3.timer(tweenPos);

                    var tweenRot = getTween.call(camera, 'rotation', temp.rotation);
                    d3.timer(tweenRot);
                    if (continent !== null) {
                        setTimeout(function() {
                            var zoom_val = 1;
                            d3.timer(function() {
                                zoom_val += 0.1;
                                camera.zoom = zoom_val;
                                camera.updateProjectionMatrix();

                                if(zoom_val >= 4) {
                                    browserHistory.push('/continent/' + slugify(continent.code, '_'));
                                    return true;
                                }
                            });
                        }, 500);
                    }
                }
            }

            function onGlobeMousemove(event) {
                var map, material;

                // Get pointc, convert to latitude/longitude
                var latlng = getEventCenter.call(this, event);

                // Look for country at that latitude/longitude
                var continent = geo.search(latlng[0], latlng[1]);

                if (continent !== null && continent.code !== currentContinent) {
                    // Track the current country displayed
                    currentContinent = continent.code;

                    // Update the html
                    d3.select("#msg").html(continent.code);

                    // Overlay the selected country
                    map = textureCache(continent.code, '#67b82c');
                    material = new THREE.MeshPhongMaterial({ map: map, transparent: true });
                    if (!overlay) {
                        overlay = new THREE.Mesh(new THREE.SphereGeometry(201, 40, 40), material);
                        overlay.rotation.y = Math.PI;
                        root.add(overlay);
                    } else {
                        overlay.material = material;
                    }
                }
            }

            setEvents(camera, [baseGlobe], 'click');
            setEvents(camera, [baseGlobe], 'mousemove', 10);
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.clear();
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }

    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height
        const { formatMessage } = this.props.intl;

        return (
            <div>
                <div id="webgl_container"></div>
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