var require ={
    baseUrl: 'js/app',
    shim: {
        // --- Use shim to mix together all THREE.js subcomponents
        'threeCore': { exports: 'THREE' },
        'TrackballControls': { deps: ['threeCore'], exports: 'THREE' },
        // --- end THREE sub-components
        'detector': { exports: 'Detector' },
        'stats': { exports: 'Stats' }
    },

    paths: {
        d3: "../lib/d3",
        three: '../lib/three',
        threeCore: '../lib/three.min',
        TrackballControls: '../lib/controls/TrackballControls',
        stats: "../lib/stats.min",
        jquery: "../lib/jquery-2.1.1",
        detector: "../lib/Detector",
        sylvester: "../lib/sylvester.min",
        binary: '//jdataview.github.io/dist/jbinary',
        jdataview: '//jdataview.github.io/dist/jdataview'
        //nifti: "../lib/nifti"
    }
};