var container, stats;
var camera, controls, scene, renderer;
var cube, plane;

var rule = {};

init();
animate();

function setRule(){
  rule.axiom = "X"
  rule.depth = 7
  rule.angle = 20
  rule.set = {'X': 'F[+X]F[-X]+X',
              'F': 'FF'}
}

function getAxiom() {
  var axiom = rule.axiom;
  var piece = '';
  var builder = "";

  for (var i = 0; i< rule.depth; i++ ){
    builder = "";
    for (var j = 0; j< axiom.length; j++ ){
      piece = axiom[j];
      if (rule.set.hasOwnProperty(piece)){
        piece = rule.set[piece];
      }
      builder += piece;
    }
    axiom = builder;
  }
  return axiom
}

function createTree(x0, y0, z0){
  var axiom = getAxiom();
  var len = axiom.length;
  var theta = rule.angle * Math.PI / 180;
  var startpoint = new THREE.Vector3(x0,y0,z0), 
      endpoint = new THREE.Vector3() ;
  var character;
  var angle = Math.PI / 2;
  var material = new THREE.LineBasicMaterial({color: 0x000000});
  var geometry,line;


  var size = 0.03;

  var stackX = []; var stackY = [];  var stackZ = []; var stackA = [];
  var stackV = []; var stackAxis = [];

  for (var i = 0; i < len; i++){
      character = axiom[i];
      switch (character){
        case '-':
          angle -= theta;
          break;
        case '+':
          angle += theta;
          break;
        case 'F':
          var newSegment = new THREE.Vector3(size*Math.cos(angle),size*Math.sin(angle),0)
          endpoint.addVectors(startpoint,newSegment)

          geometry = new THREE.Geometry();
          geometry.vertices.push(startpoint);
          geometry.vertices.push(endpoint.clone());
          startpoint = endpoint.clone();
          line = new THREE.Line(geometry, material);

          scene.add(line);

          break;
        case 'L':
          break;
        case '[':
          stackV.push(startpoint.clone());            
          stackA[stackA.length] = angle;  
          break;
        case ']':
          var point = stackV.pop();
          startpoint = point;
          angle = stackA.pop();
          break;
        default:
          break;
      }
  }

  return geometry;
}

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 2;
  camera.position.z = 11;
  camera.position.x = 5;

  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  scene = new THREE.Scene();

  // Helpers
  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );

  var size = 10;
  var step = 1;
  var gridHelper = new THREE.GridHelper( size, step );
  scene.add( gridHelper );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  //Tree
  setRule();
  createTree(0, 0, 0);  

  render();
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}

function render() {
  renderer.render( scene, camera );
}