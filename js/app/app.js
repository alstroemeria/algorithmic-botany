define( ["three", "camera", "controls", "light", "renderer", "scene", "stats", "lindenmayer", "container", "parse"],
function ( THREE, camera, controls, light, renderer, scene, Stats, lindenmayer, container, parse ) {
  var app = {
    rule: {
      'axiom': 'A',
      'angle': 22.5,
      'depth': 6,
      'set': {
        'A':'[&FL!!A]/////’[&FL!!A]///////~[&FL!!A]',
        'F':'S/////F',
        'S':'FL',
        'L':'[~~~^^{-f+f+f-|-f+f+f}]'
      }
    },
    stats: new Stats(),
    init: function () {

      var axisHelper = new THREE.AxisHelper( 5 );
      scene.add( axisHelper );
      var gridHelper = new THREE.GridHelper( 1000, 10 );
      scene.add( gridHelper );

      lindenmayer.draw(app.rule);  

      app.stats.domElement.style.position = 'absolute';
      app.stats.domElement.style.left = '0px';
      app.stats.domElement.style.top = '0px';
      container.appendChild( app.stats.domElement );

      // var gui = new dat.GUI();
      // var depth = gui.add(rule, 'depth', 0, 10);

      // console.log(hash);
      // depth.onFinishChange(function(value) {
      //   createTree(0, 0, 0);  
      //   render();
      // });
    },
    animate: function () {
      window.requestAnimationFrame( app.animate );
      renderer.render( scene, camera );
      controls.update();
      app.stats.update();
    }
  };
  return app;
} );
