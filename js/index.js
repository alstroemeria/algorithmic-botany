var container, stats;
var camera, controls, scene, renderer;
var cube, plane;

var rule = {};

init();
animate();

function setRule(){
  rule.axiom = "X"
  rule.depth = 5
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

// Transform cylinder to align with given axis and then move to center 
function makeLengthAngleAxisTransform( cyl, cylAxis, center )
{
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
}

function createCylinderFromEnds( material, radiusTop, radiusBottom, top, bottom, segmentsWidth, openEnded)
{
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
  makeLengthAngleAxisTransform( cyl, cylAxis, center );
 
  return cyl;
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


  var size = 1;

  var stackX = []; var stackY = [];  var stackZ = []; var stackA = [];
  var stackV = []; var stackAxis = [];
  var diam = 1;

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
          var material3D = new THREE.MeshLambertMaterial( { color: 0xAAAAAA , shading: THREE.FlatShading } );

          var cylinder = new createCylinderFromEnds( material3D, 
            diam-0.01, diam,
            startpoint.clone(),
            endpoint.clone());
          scene.add( cylinder );
          diam-=0.01;

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
          stackV.push({"start":startpoint.clone(), "angle":angle, "diam":diam});            
          break;
        case ']':
          var data = stackV.pop();
          startpoint = data.start;
          angle = data.angle;
          diam = data.diam;
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
  camera.position.y = 100;
  camera.position.z = 50;
  camera.position.x = 25;

      controls = new THREE.OrbitControls(camera);




  scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0x222222 );

  var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light.position.set( 200, 400, 500 );
  
  var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
  light2.position.set( -500, 250, -200 );

  scene.add(ambientLight);
  scene.add(light);
  scene.add(light2);

  // Helpers
  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );

  var size = 1000;
  var step = 10;
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