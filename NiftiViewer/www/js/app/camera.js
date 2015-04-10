define(["three"], function(THREE) {

    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
    camera.position.z = 2750;

    return camera;
});

