define( ["three", "camera", "container"], function( THREE, camera, container ) { 
  var controls = new THREE.OrbitControls( camera );
  controls.target = new THREE.Vector3(0,30,0);
  return controls;
} );
