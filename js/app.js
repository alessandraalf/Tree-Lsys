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
let ambientNightLight;
let raycaster;
var threshold = 0.1;

var circleMesh = null;

// OBJ and MTL loader
let mtlLoader = new THREE.MTLLoader();
let objLoader = new THREE.OBJLoader();

const times = [];
let fps;

let car;
let plane;

let clock = new THREE.Clock();
let speed = 4;


function init() {
    canvas = document.querySelector('#canvas-div');
    scene = new THREE.Scene();

    //calls to init methods
    initCamera();
    initControls();
    initLights();
    initGround();
    initSky();
    initCar();
    initRenderer();

    load3DObject();

    mouse = new THREE.Vector2(0, 0);

    // mouseClick position to build a new tree
    raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = threshold;

    canvas.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener("keydown", onWASD, false);

    requestAnimationFrame(render);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 15, 60);
}

function initControls() {
    controls = new THREE.OrbitControls(camera, canvas);
    controls.maxDistance = camera.far/10;
    controls.minDistance = 10;
    controls.maxPolarAngle = 80 * Math.PI/180;
}

function initLights() {
    mainLight = new THREE.PointLight(0xeeeeee, 300);
    mainLight.position.set(35, 100, 100);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 512;
    mainLight.shadow.mapSize.height = 512;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 1000;

    ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.9);

    ambientNightLight = new THREE.HemisphereLight(0x111111, 0x000000, 0);

    mainLight.name = "mainLight";
    ambientLight.name = "ambientLight";
    ambientNightLight.name = "ambientNightLight";

    scene.add(mainLight, ambientLight, ambientNightLight);
}

function initGround() {
    let grassTexture = new THREE.TextureLoader().load('textures/grass.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.x = 16;
    grassTexture.repeat.y = 16;

    let groundMaterial = new THREE.MeshPhongMaterial({map:grassTexture, shininess:5, fog:true});
    let groundGeometry = new THREE.CircleBufferGeometry(100, 32);

    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;

    scene.add(ground);
}

function initSky() {
    let skyGeometry = new THREE.SphereBufferGeometry(100, 16, 16);
    sky = new THREE.Mesh(skyGeometry, skyboxMaterial);
    sky.name = "sky";
    sky.matrixAutoUpdate = false;
    scene.add( sky );
}

function initCar() {
    car = {
        car : buildCar(),
        wheels : [],
        position : new THREE.Vector3(),
    };

    car.car.castShadow = true;
    car.car.receiveShadow = true;
    scene.add(car.car);
    car.wheels = [scene.getObjectByName('wheel1'), scene.getObjectByName('wheel2'),
                    scene.getObjectByName('wheel3'), scene.getObjectByName('wheel4')
    ];

}

function animatePlane(){
    if( plane !== null ) {
        plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.5 * toRad));
        let planePosition = new THREE.Vector3(0, 0, speed * 0.1);
        planePosition.applyQuaternion(plane.quaternion);
        plane.position.add(planePosition);
    }

}

function initRenderer() {
    renderer = new THREE.WebGLRenderer( { antialias: true, precision: 'highp' } );
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    //renderer.setPixelRatio(1);

    renderer.outputEncoding = THREE.GammaEncoding;
    renderer.gammaFactor = 2.2;

    renderer.physicallyCorrectLights = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvas.appendChild( renderer.domElement );
}

function render() {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    $("#fps").text(fps);

    // limit fps
    setTimeout( function() {
        requestAnimationFrame(render);
    }, 1000 / 40 );

    animatePlane();
    renderer.render(scene, camera);
}

function onMouseDown(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var intersections = raycaster.intersectObject(ground);
    var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
    if (intersection != null && circleMesh === null) {
        var circle = new THREE.CircleBufferGeometry(1, 16);
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
}

// function to define car movement based on WASD key input
// added collision detection
function onWASD(event) {
    let keyCode = event.key;

    if (Math.pow(car.car.position.x, 2)+Math.pow(car.car.position.z, 2)<=9050){
        if (keyCode === 'w') {

            let position = new THREE.Vector3(speed * 0.3, 0, 0);
            position.applyQuaternion(car.car.quaternion);
            car.position.add(position);
            car.car.position.copy(car.position);

            car.wheels.forEach(w => {
                w.rotation.z -= position.length() / 3;
            });

        } else if (keyCode === 's') {
            let position = new THREE.Vector3(-speed * 0.1, 0, 0);
            position.applyQuaternion(car.car.quaternion);
            car.position.add(position);
            car.car.position.copy(car.position);

            car.wheels.forEach(w => {
                w.rotation.z += position.length();
            });


        } else if (keyCode === 'd') {
            car.car.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -5 * toRad));
            let position = new THREE.Vector3(+speed * 0.1, 0, 0);
            position.applyQuaternion(car.car.quaternion);
            car.position.add(position);
            car.car.position.copy(car.position);

            car.wheels.forEach(w => {
                w.rotation.z -= position.length();
            });


        } else if (keyCode === 'a') {
            car.car.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 5 * toRad));
            let position = new THREE.Vector3(+speed * 0.1, 0, 0);
            position.applyQuaternion(car.car.quaternion);
            car.position.add(position);
            car.car.position.copy(car.position);

            car.wheels.forEach(w => {
                w.rotation.z -= position.length();
            });


        }
    }
    else{
        car.car.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 180 * toRad));
        let position = new THREE.Vector3(1, 0, 0);

        position.applyQuaternion(car.car.quaternion);
        car.position.add(position);
        car.car.position.copy(car.position);

    }



    detectCollision(car.car.children[2], treesBB);


}

// detect collision between car and trees using geometries' bounding boxes
function detectCollision(car, trees){
    car.geometry.computeBoundingBox();
    car.updateMatrixWorld();

    let box1 = car.geometry.boundingBox.clone();
    box1.applyMatrix4(car.matrixWorld);

    for (let id in trees){
        console.log(tree, "tree");
        trees[id].geometry.computeBoundingBox();
        trees[id].updateMatrixWorld();

        let box2 = trees[id].geometry.boundingBox.clone();
        box2.applyMatrix4(trees[id].matrixWorld);

        if(box1.intersectsBox(box2)) {
            console.log("bang");
            var treeToRemove = scene.getObjectByProperty('uuid', id);
            scene.remove(treeToRemove);
            delete treeID[id];
            delete treesBB[id];

            return true;
        }
    }
    return false;
}

// change scene appearance from Day to Night and vice versa
function changeDN() {
    if(document.getElementById("togBtn").value === "DAY"){
        document.getElementById("togBtn").value = "NIGHT";
        mainLight.intensity = 0;
        ambientLight.intensity = 0;
        ambientNightLight.intensity= 5;
        sky.material.color.set('black');
    }
    else{
        document.getElementById("togBtn").value = "DAY";
        ambientNightLight.intensity= 0;
        mainLight.intensity = 200;
        ambientLight.intensity = 0.9;
        sky.material = skyboxMaterial;
        sky.material.color.set('white');
    }
    //render();
}


init();