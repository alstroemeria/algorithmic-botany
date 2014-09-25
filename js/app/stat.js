define( ["stats", "container"], function( Stats, container ) { 
  var Stat = new Stats();
  Stat.domElement.style.position = 'absolute';
  Stat.domElement.style.left = '0px';
  Stat.domElement.style.top = '0px';
  container.appendChild( Stat.domElement );
  return Stat;
} );