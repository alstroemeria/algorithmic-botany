var container, stats;
var camera, controls, scene, renderer;
var cube, plane;

var rule = {};

init();
animate();

function setRule(){
  rule.axiom = "X"
  rule.depth = 4
  rule.angle = 20
  rule.set = {'X': 'F[+X]F[-X]+X',
              'F': 'F//F'}

//   rule.axiom = "A"
//   rule.depth = 2
//   rule.angle = 90
// rule.set = {'A':"B-F+CFC+F-D&F^D-F+&&CFC+F+B",
// 'B':"A&F^CFB^F^D^^-F-D^|F^B|FC^F^A",
// 'C':"|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D",
// 'D':"|CFB-F+B|FA&F^A&&FB-F+B|FC"}
// rule.axiom = "t"
// rule.depth = 5
// rule.angle = 18
// rule.set = {'t':"i+[t+o]--//[--l]i[++l]-[to]++to",
// 'i':"!Fs[//&&l][//^^l]Fs",
// 's':"sFs",
// 'l':"[{+f-ff-f+|+f-ff-f}]",
// 'o':"[&&&p~/w////w////w////w////w]",
// 'p':"FF",
// 'w':"[^F][~{&&&&-f+f|-f+f}]"}

// rule.axiom = "A"
// rule.depth = 5
// rule.angle = 22.5
// rule.set = {"A":"[&FLA]",
// 'F':"S/////F",
// 'S':"FL",
// "L":"[~~~//{-f+f+f-|-f+f+f}]"}

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
  console.log(axiom);
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
  segmentsWidth = 32 ;
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
  var character;

  var material = new THREE.LineBasicMaterial({color: 0xff0000});
  var material3D = new THREE.MeshLambertMaterial( { color: 0xAAAAAA , shading: THREE.FlatShading } );
  var geometry,line;

  var stack = [];
  var diam = 0.5;
  var polygon = false;

  var turtle = new Turtle(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,-1),3);

  for (var i = 0; i < len; i++){
      character = axiom[i];

      switch (character){
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
          var line = new THREE.Line(geometry, material);
          scene.add(line);
          break;
        case 'f':
          turtle.move();
          geometry.vertices.push(turtle.location.clone());
          break;
        case 'F':
          var tail= turtle.location.clone();
          turtle.move();
          var cylinder = new createCylinderFromEnds( material3D, diam, diam, tail, turtle.location.clone());
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
}

function Turtle(loc, xaxis,yaxis,zaxis,step){
  this.step = step;
  this.xaxis = xaxis;
  this.yaxis = yaxis;
  this.zaxis = zaxis;
  this.location = loc;

  this.copy = function(){
    return new Turtle(this.location.clone() ,this.xaxis.clone(), this.yaxis.clone() ,this.zaxis.clone(),this.step);
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

  this.clone = function(){
    return JSON.parse(JSON.stringify(this));
  }
}

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.y = 100;
  camera.position.z = 50;
  camera.position.x = 25;

  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );
  controls.center.add(new THREE.Vector3(0,0,0));


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