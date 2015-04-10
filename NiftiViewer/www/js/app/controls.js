/**
 * Created by krbalmryde on 2/23/15.
 */
define( ["three", "camera", "container"], function( THREE, camera, container ) {
    var controls = new THREE.TrackballControls( camera, container );
    return controls;
} );