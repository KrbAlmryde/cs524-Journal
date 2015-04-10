define(["three"], function(THREE){
    var material = new THREE.PointCloudMaterial( {
        size: 15,
        vertexColors: THREE.VertexColors,
        transparent: true,
        opacity: 0.4
    } );
    return material;
});