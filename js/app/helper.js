define(["three"], function (THREE) {
  var helper = {
    makeLengthAngleAxisTransform: function(cyl, cylAxis, center){
      cyl.matrixAutoUpdate = false;
      
      // From left to right using frames: translate, then rotate; TR.
      // So translate is first.
      cyl.matrix.makeTranslation( center.x, center.y, center.z );

      // take cross product of cylAxis and up vector to get axis of rotation
      var yAxis = new THREE.Vector3(0,1,0);
      // Needed later for dot product, just do it now;
      // a little lazy, should really copy it to a local Vector3.
      cylAxis.normalize();
      var rotationAxis = new THREE.Vector3();
      rotationAxis.crossVectors( cylAxis, yAxis );
      if ( rotationAxis.length() < 0.000001 )
      {
        // Special case: if rotationAxis is just about zero, set to X axis,
        // so that the angle can be given as 0 or PI. This works ONLY
        // because we know one of the two axes is +Y.
        rotationAxis.set( 1, 0, 0 );
      }
      rotationAxis.normalize();
      
      // take dot product of cylAxis and up vector to get cosine of angle of rotation
      var theta = -Math.acos( cylAxis.dot( yAxis ) );
      //cyl.matrix.makeRotationAxis( rotationAxis, theta );
      var rotMatrix = new THREE.Matrix4();
      rotMatrix.makeRotationAxis( rotationAxis, theta );
      cyl.matrix.multiply( rotMatrix );
    },
    createCylinderFromEnds: function (material, radiusTop, radiusBottom, top, bottom, segmentsWidth, openEnded){
      // defaults
      segmentsWidth = 6 ;
      openEnded = (openEnded === undefined) ? false : openEnded;

      // get cylinder height
      var cylAxis = new THREE.Vector3();
      cylAxis.subVectors( top, bottom );
      var length = cylAxis.length();

      // get cylinder center for translation
      var center = new THREE.Vector3();
      center.addVectors( top, bottom );
      center.divideScalar( 2.0 );
      ////////////////////

      var cylGeom = new THREE.CylinderGeometry( radiusTop, radiusBottom, length, segmentsWidth, 1, openEnded );
      var cyl = new THREE.Mesh( cylGeom, material );

      // pass in the cylinder itself, its desired axis, and the place to move the center.
      helper.makeLengthAngleAxisTransform( cyl, cylAxis, center );
     
      return cyl; 
    }
  }
  return helper;
});