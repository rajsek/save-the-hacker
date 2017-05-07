import * as THREE from 'three';
//import TrackballControls from 'three-trackballcontrols';
//import TrackballControls from './trackball';
var OrbitControls = require('three-orbit-controls')(THREE)
import d3 from 'd3';

var canvas, renderer, camera, scene, light, controls;
export function initScene() {
    canvas = d3.select("#webgl_container").append("canvas")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    canvas.node().getContext("webgl");

    renderer = new THREE.WebGLRenderer({ canvas: canvas.node(), antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl_container').appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);

    camera.position.z = 1000;

    scene = new THREE.Scene();

    light = new THREE.HemisphereLight('#ffffff', '#fff', 1);
    light.position.set(0, 1000, 0);
    scene.add(light);

    //controls = new TrackballControls( camera, document.getElementById('webgl_container') );
    controls = new OrbitControls(camera);
    /*controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.minDistance = 1000;
    controls.maxDistance = 3000;*/
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export function getControls() {
    return controls;
}

export function getScene() {
    return scene;
}

export function getRenderer() {
    return renderer;
}

export function getLight() {
    return light;
}

export function getCamera() {
    return camera;
}

export function getCanvas() {
    return canvas;
}






