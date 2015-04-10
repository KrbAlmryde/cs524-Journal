/**
 * Created by krbalmryde on 2/21/15.
 */

define(["three", "container", "geometry", "renderer", "statsStuff", "scene", "camera", "material", "nifti", "jquery", "controls"],
function(THREE, container, geometry, renderer, statsStuff, scene, camera, material, Nifti, $, controls){

    var app = {

        particleSystem: new THREE.PointCloud( geometry, material ),

        init: function() {
            $.ajax({url:"assets/nifti/MNI_2mm.nii", success: function(file) {

                nii = new Nifti(file);
                window.nifti = nii;
                console.log(nii);

                var particles = nii.dim[1] * nii.dim[2] * nii.dim[3];

                var positions = new Float32Array( particles * 3);
                var colors = new Float32Array( particles * 3);

                var color = new THREE.Color();

                var n = 1000, n2 = n / 2; // particles spread in the cube

                //var j = 0;
                for ( var i = 0, j = 0; i < positions.length; i += 3, j += 1 ) {

                    // positions
                    var z = i/(nii.dim[1] * nii.dim[2]),
                        r1 = i % (nii.dim[1] * nii.dim[2]),
                        y = r1/(nii.dim[2]),
                        x = r1%(nii.dim[1]);

                    // values
                    var xf = ((x / parseFloat(nii.dim[1]) * 2.0) - 1.0) * 300,
                        yf = ((y / parseFloat(nii.dim[2]) * 2.0) - 1.0) * 300,
                        zf = ((z / parseFloat(nii.dim[3]) * 2.0) - 1.0) * 300;


                    console.log(i, x, y ,z);

                    positions[   i   ] = zf;
                    positions[ i + 1 ] = yf;
                    positions[ i + 2 ] = xf;


                    // colors
                    var niiColors = { r: 0.0, g: 0.0, b: 0.5, a: 0.0};
                    if(nii.cdata[i]/255.0 > 0.1) {
                        niiColors.r = nii.cdata[i]/255.0 * Math.random();
                        niiColors.g = nii.cdata[i]/255.0 * Math.random();
                        niiColors.b = nii.cdata[i]/255.0 * Math.random();
                    }

                    color.setRGB( niiColors.r , niiColors.g , niiColors.b );

                    colors[ i ]     = color.r;
                    colors[ i + 1 ] = color.g;
                    colors[ i + 2 ] = color.b;

                }

                geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
                geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

                geometry.computeBoundingSphere();
                scene.add( app.particleSystem );
                delete(nii);
            }});
        },

        animate: function() {
            window.requestAnimationFrame( app.animate );

            app.render();
            statsStuff.update();
            controls.update();
        },

        render: function() {
            //var time = Date.now() * 0.001;
            //
            //app.particleSystem.rotation.x = time * 0.25;
            //app.particleSystem.rotation.y = time * 0.5;

            renderer.render( scene, camera );
        }
    };
    return app;
});
