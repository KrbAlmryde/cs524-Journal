/**
 * Created by krbalmryde on 2/21/15.
 */

define(["three", "container", "geometry", "renderer", "statsStuff", "scene", "camera", "material"],
function(THREE, container, geometry, renderer, statsStuff, scene, camera, material){
    var app = {

        particleSystem: new THREE.PointCloud( geometry, material ),

        init: function() {
            console.log("stats is", statsStuff);
            scene.add( app.particleSystem );
        },

        animate: function() {
            window.requestAnimationFrame( app.animate );

            app.render();
            statsStuff.update();
        },

        render: function() {
            var time = Date.now() * 0.001;

            app.particleSystem.rotation.x = time * 0.25;
            app.particleSystem.rotation.y = time * 0.5;

            renderer.render( scene, camera );
        }
    };
    return app;
});
