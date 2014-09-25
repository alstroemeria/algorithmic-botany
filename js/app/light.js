define( ["three", "scene"], function ( THREE, scene ) {
  var lights = { 
  	ambientLight: new THREE.AmbientLight( 0x222222 ),
	light: new THREE.DirectionalLight( 0xffffff, 1.0 ),
  }
  scene.add(lights.ambientLight);
  scene.add(lights.light);
  return lights;
} );
