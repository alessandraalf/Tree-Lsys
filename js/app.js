let canvas;
let camera;
let controls;
let renderer;
let scene;
let mouse;

let ground;
let sky;
let skyboxMaterial = skyGraphicInfo();
let mainLight;
let ambientLight;
let raycaster;
var threshold = 0.1;

var circleMesh = null;


function init() {
    canvas = document.querySelector('#canvas-div');
    scene = new THREE.Scene();

    //calls to init methods
    initCamera();
    initControls();
    initLights();
    initGround();
    initSky();
    initRenderer();

    mouse = new THREE.Vector2(0, 0);

    // mouseClick position to build a new tree
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    render();
    controls.addEventListener('change', render);
    window.addEventListener('load', render)
    window.addEventListener('resize', render);
    canvas.addEventListener('mousedown', onMouseDown, false);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 15, 60);
}

function initControls() {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.maxDistance = camera.far/10;
    controls.minDistance = camera.near*10;
    controls.maxPolarAngle = 80 * Math.PI/180;
}

function initLights() {
    mainLight = new THREE.PointLight(0xeeeeee, 200);
    mainLight.position.set(35, 100, 100);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 512;
    mainLight.shadow.mapSize.height = 512;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 1000;

    ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.9);

    mainLight.name = "mainLight";
    ambientLight.name = "ambientLight";

    scene.add(mainLight, ambientLight);
}

function initGround() {
    let grassTexture = new THREE.TextureLoader().load('textures/grass.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.x = 32;
    grassTexture.repeat.y = 32;

    let groundMaterial = new THREE.MeshPhongMaterial({map:grassTexture});
    let groundGeometry = new THREE.CircleGeometry(700, 100);

    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;

    scene.add(ground);
}

function initSky() {
    let skyGeometry = new THREE.SphereGeometry(700, 100, 100 );
    sky = new THREE.Mesh(skyGeometry, skyboxMaterial);
    sky.name = "sky";
    scene.add( sky );
}

function initRenderer() {
    // controllare parametri disponibili di WEBGL renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.outputEncoding = THREE.GammaEncoding;
    renderer.gammaFactor = 2.2;


    renderer.physicallyCorrectLights = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // console.log(canvas)
    canvas.appendChild( renderer.domElement );

}

function render() {
    console.log("render")
    renderer.render( scene, camera );
}

function onMouseDown(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var intersections = raycaster.intersectObject(ground);
    var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
    if (intersection != null && circleMesh === null) {
        var circle = new THREE.CircleGeometry(1, 32);
        var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        circleMesh = new THREE.Mesh(circle, material);
        circleMesh.rotateX(270*toRad);
        circleMesh.position.copy(intersection.point);
        circleMesh.position.add(new THREE.Vector3(0, 0.01, 0));
        circleMesh.name = 'mouseClick';
        scene.add(circleMesh);
    } else if (intersection != null) {
        circleMesh.position.copy(intersection.point);
        circleMesh.position.add(new THREE.Vector3(0, 0.01, 0));
    }
    render();
}

// change scene appearance from Day to Night and vice versa
function changeDN() {
    if(document.getElementById("togBtn").value === "DAY"){
        document.getElementById("togBtn").value = "NIGHT";
        scene.remove(mainLight, ambientLight, sky);
        ambientLight = new THREE.HemisphereLight(0x111111, 0x000000, 5);
        scene.add(ambientLight);
    }
    else{
        document.getElementById("togBtn").value = "DAY";
        scene.remove(ambientLight);
        initLights();
        initSky();
    }
    render();
}

init();