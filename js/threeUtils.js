

//define sky material with texture
function skyGraphicInfo(){
    let skyTexture = new THREE.TextureLoader().load('textures/sky2.jpg');
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    let skyMaterial = new THREE.MeshBasicMaterial({map:skyTexture});
    skyMaterial.side = THREE.BackSide;
    return skyMaterial;
}


//define wood material with texture
function woodGraphicInfo(){
    let woodTexture = new THREE.TextureLoader().load('textures/wood2.jpg');
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    let woodMaterial = new THREE.MeshPhongMaterial({map:woodTexture, shininess:15});
    return woodMaterial;
}

//define leaf material with texture
function leafGraphicInfo(){
    let leafTexture = new THREE.TextureLoader().load('textures/leaf2.jpg');
    //leafTexture.wrapS = THREE.RepeatWrapping;
    //leafTexture.wrapT = THREE.RepeatWrapping;
    let leafMaterial = new THREE.MeshPhongMaterial({map: leafTexture, shininess:0});

    //let leafMaterial = new THREE.MeshPhongMaterial({color:'#2e3c3c', shininess:0});
    return leafMaterial;
}

//build default leaf geometry
function buildLeafGeometry_v3() {
    var leafGeometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
        0, 0, 0,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.75, 1, 0.5,
        0.75, 1, 0.5,
        0, 2.5, 0
    ] );

    var faces = new Uint32Array([
        0, 1, 3,
        0, 3, 5,
        0, 5, 4,
        0, 4, 2,
        3, 1, 0,
        5, 3, 0,
        4, 5, 0,
        2, 4, 0
    ]);

    /*var uvs = new Float32Array([
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        0, 1,
        1, 1,
        0, 0,
        0, 1,
    ]);

     */

    var norm = new Float32Array([
        -0.25, -0.125, -0.125,
        -1.25, 0, -1.875,
        1.25, 0, -1.875,
        0.25, -0.125, -0.125,
        0.25, 0.125, 0.125,
        1.25, 0, 1.875,
        -1.25, 0, 1.875,
        -0.25, 0.125, 0.125
    ]);

    leafGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //leafGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    leafGeometry.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    leafGeometry.setIndex(new THREE.BufferAttribute(faces, 1 ));

    return leafGeometry;
}

//build default leaf geometry
function buildLeafGeometry() {
    let leafGeometry = new THREE.Geometry();

    let stem = new THREE.CylinderGeometry(0.01, 0.15, 3, 8);
    let stemMesh = new THREE.Mesh(stem);
    stemMesh.position.set(0, 1.5, 0);

    leafGeometry.mergeMesh(stemMesh);

    let leafBody = new THREE.Geometry();

    leafBody.vertices.push( new THREE.Vector3(0,0,0) );
    leafBody.vertices.push( new THREE.Vector3(-1.5,1.5,1) );
    leafBody.vertices.push( new THREE.Vector3(1.5,1.5,1) );
    leafBody.vertices.push( new THREE.Vector3(-1,4,0.5) );
    leafBody.vertices.push( new THREE.Vector3(1,4,0.5) );
    leafBody.vertices.push( new THREE.Vector3(0,5.5,-1) ) ;

    leafBody.faces.push( new THREE.Face3( 0, 1, 3 ) );
    leafBody.faces.push( new THREE.Face3( 0, 3, 5 ) );
    leafBody.faces.push( new THREE.Face3( 0, 5, 4 ) );
    leafBody.faces.push( new THREE.Face3( 0, 4, 2 ) );
    leafBody.faces.push( new THREE.Face3( 3, 1, 0 ) );
    leafBody.faces.push( new THREE.Face3( 5, 3, 0 ) );
    leafBody.faces.push( new THREE.Face3( 4, 5, 0 ) );
    leafBody.faces.push( new THREE.Face3( 2, 4, 0 ) );

    leafBody.faceVertexUvs[0].push([new THREE.Vector2(1, .5),new THREE.Vector2(.6, 1),new THREE.Vector2(.15, 1)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(1, .5),new THREE.Vector2(.15, 1),new THREE.Vector2(0, .5)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(1, .5),new THREE.Vector2(0, .5),new THREE.Vector2(.15, 0)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(1, .5),new THREE.Vector2(.15, 0),new THREE.Vector2(.6, 0)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(.15, 1),new THREE.Vector2(.6, 1),new THREE.Vector2(1, .5)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(0, .5),new THREE.Vector2(.15, 1),new THREE.Vector2(1, .5)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(.15, 0),new THREE.Vector2(0, .5),new THREE.Vector2(1, .5)]);
    leafBody.faceVertexUvs[0].push([new THREE.Vector2(.6, 0),new THREE.Vector2(.15, 0),new THREE.Vector2(1, .5)]);
    leafBody.computeFaceNormals();

    let leafMesh = new THREE.Mesh(leafBody);
    leafMesh.position.set(0, 1.5, 0);

    leafGeometry.mergeMesh(leafMesh);
    return leafGeometry;
}

function buildLeafGeometry_v2(){

    var leafShape = new THREE.Shape();
    leafShape.moveTo(0,0);

    /*
    leafShape.bezierCurveTo( 0, 0, 0.5, 0, 0.5, 1 );
    leafShape.bezierCurveTo( 0.5, 1, 0.35, 1.5, 0, 2 );
    leafShape.bezierCurveTo( 0, 2, -0.35, 1.5, -0.5, 1 );
    leafShape.bezierCurveTo( -0.5, 1, -0.5, 0, 0, 0 );

     */

    /*
    leafShape.bezierCurveTo( 0, 0, 0.05, 0.25, 0.05, 1);

    leafShape.bezierCurveTo( 0.05, 1, 0.5, 1, 0.5, 2 );
    leafShape.bezierCurveTo( 0.5, 2, 0.35, 2.5, 0, 3 );
    leafShape.bezierCurveTo( 0, 3, -0.35, 2.5, -0.5, 2 );
    leafShape.bezierCurveTo( -0.5, 2, -0.5, 1, -0.05, 1 );

    leafShape.bezierCurveTo( -0.05, 1, -0.05, 0.25, 0, 0);

     */

    leafShape.bezierCurveTo( 0, 0, 0.05, 0.25, 0.05, 0.7);

    leafShape.bezierCurveTo( 0.05, 0.7, 1, 0, 0, 1.5);

    leafShape.bezierCurveTo( 0, 1.5, -1, 0, -0.05, 0.7 );

    leafShape.bezierCurveTo( -0.05, 0.7, -0.05, 0.25, 0, 0);


/*
    let extrudeSettings = {
        steps: 2,
        depth: 0.05,
        bevelEnabled: false,
        bevelOffset: 1,
        bevelSegments: 1
    };

    let leafGeometry = new THREE.ExtrudeBufferGeometry(leafShape, extrudeSettings );
*/
    let leafGeometry = new THREE.ShapeGeometry(leafShape);

    return leafGeometry;
}

function buildLeafGeometry_v3(){

    var leafShape = new THREE.Shape();
    leafShape.moveTo(0,0);


    leafShape.bezierCurveTo( 0, 0, 0.05, 0.25, 0.05, 0.7);

    leafShape.bezierCurveTo( 0.05, 0.7, 1, 0, 0, 1.5);

    leafShape.bezierCurveTo( 0, 1.5, -1, 0, -0.05, 0.7 );

    leafShape.bezierCurveTo( -0.05, 0.7, -0.05, 0.25, 0, 0);

    let extrudeSettings = {
        steps: 1,
        depth: 0.05,
        bevelEnabled: true,
        bevelOffset: 1,
        bevelThickness: 1,
        bevelSegments: 0
    };

    let leafGeometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings );


    return leafGeometry;
}


function load3DObject(){
    mtlLoader.load('plane/plane.mtl', function(materials) {
        materials.preload();
        // load the object
        objLoader.setMaterials(materials);
        objLoader.load('plane/plane.obj', function (object) {

            object.position.set(0, 25, -35);
            object.scale.set(0.05, 0.05, 0.05);
            plane = object;
            plane.name = 'object3D';
            plane.rotation.y = -Math.PI/2;
            scene.add(plane);

            plane.traverse( function( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );
            //plane.castShadow = true;
        } );
    } );

}


//build car
function buildCar() {
    let car = new THREE.Group();

    let carLight1 = new THREE.PointLight(0xfffddb, 5, 12);
    carLight1.position.set(4, 2.2, 1.20);
    carLight1.castShadow = true;
    let carLight2 = new THREE.PointLight(0xfffddb, 5, 12);
    carLight2.position.set(4, 2.2, -1.20);
    carLight2.castShadow = true;

    car.add(carLight1);
    car.add(carLight2);


    let carbodyGeometry = new THREE.Geometry();

    let car1Texture = new THREE.TextureLoader().load('textures/car2.png');
    let car2Texture = new THREE.TextureLoader().load('textures/car.png');
    let wheelTexture = new THREE.TextureLoader().load('textures/wheel2.png');


    let car1Material = [
        new THREE.MeshPhongMaterial({map: car1Texture}),
        new THREE.MeshPhongMaterial({map: car1Texture}),
        new THREE.MeshPhongMaterial({color:'red'}),
        new THREE.MeshPhongMaterial({color:'red'}),
        new THREE.MeshPhongMaterial({color:'red'}),
        new THREE.MeshPhongMaterial({color:'red'}),
    ];
    let car2Material = [
        new THREE.MeshPhongMaterial({map: car2Texture}),
        new THREE.MeshPhongMaterial({color: 'red' }),
        new THREE.MeshPhongMaterial({color: 'red' }),
        new THREE.MeshPhongMaterial({color: 'red' }),
        new THREE.MeshPhongMaterial({color: 'red' }),
        new THREE.MeshPhongMaterial({color: 'red' }),
    ];

    let wheelMaterial = [
        new THREE.MeshPhongMaterial({color: '#333333' }),
        new THREE.MeshPhongMaterial({map: wheelTexture, color:'white'}),
        new THREE.MeshPhongMaterial({map: wheelTexture, color:'white'})
    ];


    let carGeometry1 = new THREE.BoxGeometry(6, 2, 4, 0, 0, 0);
    let carMesh1 = new THREE.Mesh(carGeometry1, car1Material);
    carMesh1.position.set(0, 2, 0);
    car.add(carMesh1);

    let carGeometry2 = new THREE.BoxGeometry(3, 2, 4, 0, 0, 0);
    let carMesh2 = new THREE.Mesh(carGeometry2, car2Material);
    carMesh2.position.set(-1.5, 4, 0);
    car.add(carMesh2);

    carMesh1.castShadow = true;
    carMesh2.castShadow = true;

    // wheels
    let wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 16);
    wheelGeometry.rotateX(Math.PI * 0.5);

    let wheelClone = wheelGeometry.clone();
    //let wheel1 = wheelGeometry.clone();
    //let wheelMesh1 = new THREE.Mesh(wheel1);

    let wheel1 = new THREE.Mesh(wheelClone, wheelMaterial);
    wheel1.position.set(2, 1, 2);
    wheel1.name = 'wheel1';
    car.add(wheel1);

    let wheel2 = new THREE.Mesh(wheelClone, wheelMaterial);
    wheel2.position.set(-2, 1, 2);
    wheel2.name = 'wheel2';
    car.add(wheel2);


    let wheel3 = new THREE.Mesh(wheelClone, wheelMaterial);
    wheel3.position.set(2, 1, -2);
    wheel3.name = 'wheel3';
    car.add(wheel3);

    let wheel4 = new THREE.Mesh(wheelClone, wheelMaterial);
    wheel4.position.set(-2, 1, -2);
    wheel4.name = 'wheel4';
    car.add(wheel4);


    //wheels.castShadow = true;

    //car.add(wheels);

    return car;
}


//delete last tree added to scene
function deleteLastTree(){
    var keys = Object.keys(treeID);
    var lastTreeId = keys[keys.length - 1];
    var treeToRemove = scene.getObjectByProperty('uuid', lastTreeId);
    scene.remove(treeToRemove);
    delete treeID[lastTreeId];
    //render();
}

//delete all trees in scene
function deleteAllTrees() {
    for(var id in treeID){
        var treeToRemove = scene.getObjectByProperty('uuid', id);
        scene.remove(treeToRemove);
        delete treeID[id];
        //render();
    }
}
