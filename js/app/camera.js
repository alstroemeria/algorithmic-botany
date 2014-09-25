define( ["three", "container"], function ( THREE, container ) {
  var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 30;
  camera.position.z = 70;
  
  var updateSize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return camera;
} );
