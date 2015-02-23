/**
 * Created by krbalmryde on 2/5/15.
 */

var nii = d3.select("#nii");

var rois = [ new X.volume(),
    new X.volume(),
    new X.volume(),
    new X.volume() ];

var file = ["assets/nifti/MNI_2mm.nii",
    "assets/nifti/all_s1_IC2_caez_2blur_LR.nii",
    "assets/nifti/all_s1_IC7_caez_2blur_LR.nii",
    "assets/nifti/all_s1_IC7_caez_2blur_LR.nii"];

function run() {

    var renderer0 = new X.renderer3D();
        renderer0.container = 'nii';
        renderer0.init();

    var Hierarchy = new X.object();
    var scene = new X.object();
        scene.children.push(Hierarchy);

    window.rois = rois;

    //////// Build the ROIs /////////
    for (var i = 0; i < 4; i++) {
        rois[i].file = file[i];
        rois[i].volumeRendering = true;
        rois[i].visible = true;
        rois[i].reslicing = true;
        if (i > 0) {
            rois[i].caption = "c1t"+i;
            rois[i].opacity = 1.0;
            rois[i].lowerThreshold = 1.75;  // This is hardcoded
            rois[i].color = [Math.random(), Math.random(), Math.random()];
        } else {
            rois[i].caption = "brain";
            rois[i].opacity = 0.8;
            rois[i].color = [0.5, 0.5, 0.5];
            rois[i].lowerThreshold = 80;
            rois[i].windowLower = 115;
            rois[i].windowHigh = 360;
            rois[i].minColor = [0.2, 0.2, 0.2];
            rois[i].maxColor = [0.5, 0.5, 0.5];
        }
        nii.append('p').attr("align", "left")
            .text(rois[i].caption)
            .append("input").attr("type", "checkbox")
            .attr("value", i)
            .attr("checked", "true")
            .attr("name", rois[i].caption)
            .on("click", function() {
                var val = parseInt(this.value);
                console.log(val, typeof(val));
                console.log('before', rois[val].visible);
                if(rois[val].visible) {
                    rois[val].visible = false;
                } else {
                    rois[val].visible = true
                }
                console.log('after', rois[val].visible);
            });
        scene.children.push(rois[i]);
    }

    // nii.select('t0').onClick(function(){
    //     console.log(this)
    // })

    nii.append("input").attr("type", "range")
        .attr("id","opac_slider")
        .attr("min","0.01")
        .attr("max","0.99")
        .attr("step","0.01")
        .attr("value","0.8")
        .on("change", function() {
            var val = this.value;
            console.log(val, typeof(val))

            rois[0].opacity = parseFloat(val);
        });



    renderer0.add(scene);
    renderer0.camera.position = [0.0, 199.682384341637, 0.0];
    renderer0.camera.up = [0.0, 0.0, 1.0];
    renderer0.render();
}