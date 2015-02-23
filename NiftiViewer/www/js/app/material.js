define(["three"], function(THREE){
    var material = new THREE.PointCloudMaterial( { size: 15, vertexColors: THREE.VertexColors } );
    return material;
});