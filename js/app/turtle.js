define(["three"], function (THREE) {
  var Turtle = function (loc, xaxis, yaxis, zaxis, step, weight) {
    this.step = step;
    this.xaxis = xaxis;
    this.yaxis = yaxis;
    this.zaxis = zaxis;
    this.weight = weight;
    this.location = loc;

    this.copy = function(){
      return new Turtle(this.location.clone() ,this.xaxis.clone(), this.yaxis.clone() ,this.zaxis.clone(),this.step,this.weight);
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
  
  return Turtle;
});

