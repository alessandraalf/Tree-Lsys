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
    let woodMaterial = new THREE.MeshPhongMaterial({map:woodTexture});
    return woodMaterial;
}

//define leaf material with texture
function leafGraphicInfo(){
    let leafTexture = new THREE.TextureLoader().load('textures/leaf.jpg');
    leafTexture.wrapS = THREE.RepeatWrapping;
    leafTexture.wrapT = THREE.RepeatWrapping;
    let leafMaterial = new THREE.MeshStandardMaterial({map:leafTexture});
    return leafMaterial;
}

//build default leaf geometry
function buildLeafGeometry(leafScale) {
    var leafGeometry = new THREE.Geometry();
    leafGeometry.vertices.push(
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(-0.5*leafScale,0.5*leafScale,0.5*leafScale),
        new THREE.Vector3(0.5*leafScale,0.5*leafScale,0.5*leafScale),
        new THREE.Vector3(-0.75*leafScale,1*leafScale,0.5*leafScale),
        new THREE.Vector3(0.75*leafScale,1*leafScale,0.5*leafScale),
        new THREE.Vector3(0,2.5*leafScale,0)
    );

    leafGeometry.faces.push( new THREE.Face3( 0, 1, 3 ) );
    leafGeometry.faces.push( new THREE.Face3( 0, 3, 5 ) );
    leafGeometry.faces.push( new THREE.Face3( 0, 5, 4 ) );
    leafGeometry.faces.push( new THREE.Face3( 0, 4, 2 ) );
    leafGeometry.faces.push( new THREE.Face3( 3, 1, 0 ) );
    leafGeometry.faces.push( new THREE.Face3( 5, 3, 0 ) );
    leafGeometry.faces.push( new THREE.Face3( 4, 5, 0 ) );
    leafGeometry.faces.push( new THREE.Face3( 2, 4, 0 ) );

    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);
    leafGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)]);

    leafGeometry.computeFaceNormals();
    return leafGeometry;
}

//delete last tree added to scene
function deleteLastTree(){
    var keys = Object.keys(treeID);
    var lastTreeId = keys[keys.length - 1];
    var treeToRemove = scene.getObjectByProperty('uuid', lastTreeId);
    scene.remove(treeToRemove);
    delete treeID[lastTreeId];
    render();
}

//delete all trees in scene
function deleteAllTrees() {
    for(var id in treeID){
        var treeToRemove = scene.getObjectByProperty('uuid', id);
        scene.remove(treeToRemove);
        delete treeID[id];
        render();
    }
}
