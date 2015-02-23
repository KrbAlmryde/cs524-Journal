define(["three"], function(THREE){
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    return scene;
});