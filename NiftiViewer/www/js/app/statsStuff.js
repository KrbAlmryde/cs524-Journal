define(["stats", "container"], function(Stats, container){
    var statsStuff = new Stats();
    statsStuff.domElement.style.position = 'absolute';
    statsStuff.domElement.style.top = '0px';
    container.appendChild( statsStuff.domElement );
    return statsStuff;
});