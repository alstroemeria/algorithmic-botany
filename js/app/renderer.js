define( ["three", "container"], function ( THREE, container ) {
  container.innerHTML = "";
  var  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xf0f0f0 );
  container.appendChild( renderer.domElement );

  var updateSize = function () {
    renderer.setSize( window.innerWidth , window.innerHeight );
  };
  window.addEventListener( 'resize', updateSize, false );
  updateSize();

  return renderer;
} );
