define(["three", "nifti", "jquery"], function(THREE, Nifti, $){
    var geometry = new THREE.BufferGeometry();
    //$.ajax({url:"assets/nifti/MNI_2mm.nii", success: function(file) {
    //
    //    nii = new Nifti(file);
    //
    //    console.log(nii.cdata);
    //
    //    var particles = nii.dim[1] * nii.dim[2] * nii.dim[3];
    //
    //    var geometry = new THREE.BufferGeometry();
    //
    //    var positions = new Float32Array( particles);
    //    var colors = new Float32Array( particles);
    //
    //    var color = new THREE.Color();
    //
    //    var n = 1000, n2 = n / 2; // particles spread in the cube
    //
    //
    //    for ( var i = 0; i < positions.length; i += 3 ) {
    //
    //        // positions
    //
    //        var x = Math.random() * n - n2;
    //        var y = Math.random() * n - n2;
    //        var z = Math.random() * n - n2;
    //
    //        positions[ i ]     = nii.cdata[i];
    //        positions[ i + 1 ] = nii.cdata[i+1];
    //        positions[ i + 2 ] = nii.cdata[i+2];
    //
    //        // colors
    //
    //        var vx = ( x / n ) + 0.5;
    //        var vy = ( y / n ) + 0.5;
    //        var vz = ( z / n ) + 0.5;
    //
    //        color.setRGB( nii.cdata[i], nii.cdata[i], nii.cdata[i] );
    //
    //        colors[ i ]     = color.r;
    //        colors[ i + 1 ] = color.g;
    //        colors[ i + 2 ] = color.b;
    //
    //    }
    //
    //    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    //    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    //
    //    geometry.computeBoundingSphere();
    //
    //    return geometry;
    //}});
    return geometry;
});
