define( ["three", "camera", "controls", "geometry", "light", "renderer", "scene", "stats", "turtle", "container"],
function ( THREE, camera, controls, Geometry, light, renderer, scene, Stats, Turtle, container ) {
  var app = {
    meshes: [],
    rule: {},
    stats: new Stats(),
    tree: {
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
    load: function () {
      app.rule.axiom = this.tree.axiom;
      app.rule.depth = this.tree.depth;
      app.rule.angle = this.tree.angle;
      app.rule.set = this.tree.set;
    },
    parse: function() {
      var axiom = app.rule.axiom;
      var piece = '';
      var builder = "";

      for (var i = 0; i< app.rule.depth; i++ ){
        builder = "";
        for (var j = 0; j< axiom.length; j++ ){
          piece = axiom[j];
          if (app.rule.set.hasOwnProperty(piece)){
            piece = app.rule.set[piece];
          }
          builder += piece;
        }
        axiom = builder;
      }
      console.log(axiom);
      return axiom;
    },
    draw: function () {
      var axiom = app.parse();
      var len = axiom.length;
      var theta = app.rule.angle * Math.PI / 180;
      var character;

      var material = new THREE.MeshBasicMaterial({color:"#ff0000"});
      var material3D = new THREE.MeshLambertMaterial( { color: 0xAAAAAA , shading: THREE.FlatShading } );
      var geometry,line;

      var stack = [];

      var turtle = new Turtle(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),3,0.5);

      for (var i = 0; i < len; i++){
          character = axiom[i];

          switch (character){
            case '!':
              turtle.exercise(0.05);
              break;
            case '+':
              turtle.yaw(theta);
              break;
            case '-':
              turtle.yaw(-theta);
              break;
            case '\\':
              turtle.roll(theta);
              break;
            case '/':
              turtle.roll(-theta);
              break;
            case '&':
              turtle.pitch(theta);
              break;
            case '^':
              turtle.pitch(-theta);
              break;
            case '|':
              turtle.yaw(Math.PI);
              break;
            case '{':
              stack.push(turtle.copy());            
              geometry = new THREE.Geometry();
              geometry.vertices.push( turtle.location.clone() );
              break;
            case '}':
              turtle = stack.pop();

              for (x = 0; x < geometry.vertices.length-2; x++) {
                geometry.faces.push(new THREE.Face3(0, x + 1, x + 2));
              }
              geometry.computeBoundingSphere();

              mesh = new THREE.Mesh(geometry, material);
              scene.add(mesh);

              break;
            case 'f':
              turtle.move();
              geometry.vertices.push(turtle.location.clone());
              break;
            case 'F':
              var tail= turtle.location.clone();
              turtle.move();
              var cylinder = Geometry.createCylinderFromEnds( material3D, turtle.weight,turtle.weight, tail, turtle.location.clone());
              scene.add(cylinder);
              break;
            case 'L':
              break;
            case '[':
              stack.push(turtle.copy());            
              break;
            case ']':
              turtle = stack.pop();
              break;
            default:
              break;
          }
      }
      return geometry;
    },
    init: function () {
      var axisHelper = new THREE.AxisHelper( 5 );
      scene.add( axisHelper );
      var size = 1000;
      var step = 10;
      var gridHelper = new THREE.GridHelper( size, step );
      scene.add( gridHelper );

      //Tree
      app.load();
      app.draw(0, 0, 0);  

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
      controls.update();
      renderer.render( scene, camera );
      app.stats.update();
    }
  };
  return app;
} );
