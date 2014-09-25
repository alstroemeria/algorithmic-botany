define(["three", "scene", "parse", "helper"], function (THREE, scene, parse, helper) {
  var Lindenmayer = {
    draw: function (rule) {
      var axiom = parse(rule);
      var len = axiom.length;
      var theta = rule.angle * Math.PI / 180;
      var character;
      var material = new THREE.MeshBasicMaterial({color:"#ff0000"});
      var material3D = new THREE.MeshLambertMaterial( { color: 0xAAAAAA , shading: THREE.FlatShading } );
      var geometry,line;
      var stack = [];
      var turtle = new Lindenmayer.Turtle(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),3,0.5);

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
              var cylinder = helper.createCylinderFromEnds( material3D, turtle.weight,turtle.weight, tail, turtle.location.clone());
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
    Turtle: function (loc, xaxis, yaxis, zaxis, step, weight) {
      this.step = step;
      this.xaxis = xaxis;
      this.yaxis = yaxis;
      this.zaxis = zaxis;
      this.weight = weight;
      this.location = loc;

      this.copy = function(){
        return new Lindenmayer.Turtle(this.location.clone() ,this.xaxis.clone(), this.yaxis.clone() ,this.zaxis.clone(),this.step,this.weight);
      }

      this.draw = function(axis){
        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xAAAAAA} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.x = this.location.x;
        sphere.position.y = this.location.y;
        sphere.position.z = this.location.z;
        scene.add( sphere );

        if (axis){
          var dir = xaxis;
          var origin = this.location;
          var length = 50;
          var hex = 0xff0000;
          var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
          scene.add( arrowHelper );

          var dir = yaxis;
          var origin = this.location;
          var length = 50;
          var hex = 0x00ff00;
          var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
          scene.add( arrowHelper );

          var dir = zaxis;
          var origin = this.location;
          var length = 50;
          var hex = 0x0000ff;
          var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        }
        scene.add( arrowHelper );
      }

      this.move = function(){
        var partial = xaxis.clone().multiplyScalar(this.step);
        this.location.addVectors(this.location,partial);
      }

      this.roll = function(theta){
        yaxis.applyAxisAngle(xaxis,theta);
        zaxis.applyAxisAngle(xaxis,theta);
      }

      this.pitch = function(theta){
        xaxis.applyAxisAngle(yaxis,theta);
        zaxis.applyAxisAngle(yaxis,theta);
      }

      this.yaw = function(theta){
        xaxis.applyAxisAngle(zaxis,theta);
        yaxis.applyAxisAngle(zaxis,theta);
      }

      this.exercise = function(intensity){
        this.weight-=intensity;
      }

      this.clone = function(){
        return JSON.parse(JSON.stringify(this));
      }
    }
  }
  return Lindenmayer;
});

