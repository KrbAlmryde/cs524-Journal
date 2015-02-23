/**
 * Created by krbalmryde on 2/21/15.
 */

define(function(require){

    var $ = require('jquery'),
        nifti = require('nifti');

    requirejs(['three','detector'], function(THREE, Detector){

        console.log(Detector);

        if ( !Detector.webgl ) Detector.addGetWebGLMessage();
        //new FileReader;


        ////////////////////////////  Define Global Vars  ////////////////////////////
        var container, stats,
            camera, scene, renderer,
            vol;

        ////////////////////////////  Start the Application  ////////////////////////////

        init();
        animate();

        //////////////////////////// Function Definitions ////////////////////////////

        function init() {

            container = $( 'container' );


            camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
            camera.position.z = 2750;

            scene = new THREE.Scene();
            scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

            //renderer = new X.renderer3D();
            //renderer.container = 'container';
            //renderer.init();

            //vol = nifti.parse("assets/nifti/MNI_2mm.nii");

            //vol = new X.volume();
            //vol.file = "assets/nifti/MNI_2mm.nii";
            //vol.volumeRendering = true;
            //vol.reslicing = true;
            //vol.caption = "brain";
            //vol.opacity = 0.8;
            //vol.color = [0.5, 0.5, 0.5];
            //vol.lowerThreshold = 80;
            //vol.windowLower = 115;
            //vol.windowHigh = 360;
            //vol.minColor = [0.2, 0.2, 0.2];
            //vol.maxColor = [0.5, 0.5, 0.5];
            //window.vol = vol;

            //renderer.add(volume);
            //renderer.render();

            //

            var particles = 500000;

            var geometry = new THREE.BufferGeometry();

            var positions = new Float32Array( particles * 3 );
            var colors = new Float32Array( particles * 3 );

            var color = new THREE.Color();

            var n = 1000, n2 = n / 2; // particles spread in the cube

            //for (var i = 0; i < 91; i += 1) {
            //    for (var j = 0; j < 109; j += 1) {
            //        for (var k = 0; k < 91; k += 1) {
            //            console.log("volume", vol.image);
            //        }
            //    }
            //}
            console.log("volume", vol);
            //renderer.destroy();

            for ( var i = 0; i < positions.length; i += 3 ) {

                // positions

                var x = Math.random() * n - n2;
                var y = Math.random() * n - n2;
                var z = Math.random() * n - n2;

                positions[ i ]     = x;
                positions[ i + 1 ] = y;
                positions[ i + 2 ] = z;

                // colors

                var vx = ( x / n ) + 0.5;
                var vy = ( y / n ) + 0.5;
                var vz = ( z / n ) + 0.5;

                color.setRGB( vx, vy, vz );

                colors[ i ]     = color.r;
                colors[ i + 1 ] = color.g;
                colors[ i + 2 ] = color.b;

            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

            geometry.computeBoundingSphere();

            //

            var material = new THREE.PointCloudMaterial( { size: 15, vertexColors: THREE.VertexColors } );

            particleSystem = new THREE.PointCloud( geometry, material );
            scene.add( particleSystem );

            //

            renderer = new THREE.WebGLRenderer( { antialias: false } );
            renderer.setClearColor( scene.fog.color );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );

            container.appendChild( renderer.domElement );

            //

            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            container.appendChild( stats.domElement );

            //

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

        //

        function animate() {

            requestAnimationFrame( animate );

            render();
            stats.update();

        }

        function render() {

            var time = Date.now() * 0.001;

            particleSystem.rotation.x = time * 0.25;
            particleSystem.rotation.y = time * 0.5;

            renderer.render( scene, camera );

        }

    });
})
