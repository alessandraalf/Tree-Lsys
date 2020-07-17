let tree;
let barkTotalGeometry;
let leafTotalGeometry;

// associative array {tree 'uuid' : tree position in the scene}
let treeID = [];
let treesBB = [];

// initialize wood and leaf material
let woodMaterial = woodGraphicInfo();
let leafMaterial = leafGraphicInfo();

let branchGeometry;
// define leaf geometry
let leafGeometries = [buildLeafGeometry(), buildLeafGeometry_v2(), buildLeafGeometry_v3()];

let mouseClick;
const toRad = Math.PI/180;


function buildTree() {

    let treeInfo = getTreeSettings();

    let rules = ruleToArray(treeInfo.rules);

    let treeString = treeStringDerivation(treeInfo, rules);

    tree = new THREE.Group();

    barkTotalGeometry = new THREE.Geometry();
    leafTotalGeometry = new THREE.Geometry();

    let randomPos = new THREE.Vector3(Math.random() * (50 - (-50)) + (-50), 0, Math.random() * (50 - (-50)) + (-50));

    tree.matrixAutoUpdate = false;
    let treeInitialPosition = (scene.getObjectByName('mouseClick') !== undefined) ?
        scene.getObjectByName('mouseClick').position : randomPos;

    checkTreePosition(treeInitialPosition);

    // define branch geometry
    branchGeometry = new THREE.CylinderGeometry(treeInfo.branchRadius*(1-treeInfo.branchReduction), treeInfo.branchRadius, treeInfo.branchLength, 8);
    buildTreeFromString(treeString, treeInfo, treeInitialPosition);

    // activate shadows
    tree.castShadow = true;
    tree.receiveShadow = true;

    barkTotalGeometry = new THREE.BufferGeometry().fromGeometry(barkTotalGeometry);
    leafTotalGeometry = new THREE.BufferGeometry().fromGeometry(leafTotalGeometry);

    tree.name = treeInfo.preset;

    let barkMesh = new THREE.Mesh(barkTotalGeometry, woodMaterial);
    barkMesh.castShadow = true;
    barkMesh.receiveShadow = true;

    let leafsMesh;
    if(treeInfo.preset < 5){
        leafsMesh = new THREE.Mesh(leafTotalGeometry, leafMaterial);
    }
    else{
        leafsMesh = new THREE.Mesh(leafTotalGeometry, new THREE.MeshPhongMaterial({color:'#0c3618', shiness: 1}));
    }

    leafsMesh.castShadow = true;
    leafsMesh.receiveShadow = true;

    tree.add(barkMesh, leafsMesh);
    scene.add(tree);

    treeID[tree.uuid] = treeInitialPosition;

    // mesh bounding box for collision detection
    let boxMesh = new THREE.Mesh(new THREE.BoxGeometry(treeInfo.branchRadius*4, 20, treeInfo.branchRadius*3));
    boxMesh.position.set(treeInitialPosition.x, treeInitialPosition.y, treeInitialPosition.z);
    treesBB[tree.uuid] = boxMesh;

    // clear raycast click
    if (scene.getObjectByName('mouseClick') !== undefined){
        scene.remove(scene.getObjectByName('mouseClick'));
        circleMesh = null;
    }

}

// get (updated) settings from html form
function getTreeSettings() {
    return new TreeSettings({
        preset: $("#preset").val(),
        axiom: $("#axiom").val(),
        rules: $("#rules").val(),
        iterations: $("#iterations").val(),
        delta: $("#delta").val(),
        branchLength: $("#branchLength").val(),
        branchRadius: $("#branchRadius").val(),
        branchReduction: $("#branchReduction").val(),
        branchMinRadius: $("#branchMinRadius").val()
    });
}

// init treeStatus variables for specified tree
function initTreeStatus(treeInfo, treeInitialPosition) {
    return {
        bRadius : treeInfo.branchRadius,
        bLength : treeInfo.branchLength,
        bScale : 1.0,
        currentPosition : treeInitialPosition.clone(),
        rotation : new THREE.Quaternion()
    };
}

// parse rules string and create a rule array
function ruleToArray(rules) {
    var r = rules.replace(/ /g,'');
    var result = [];
    r.split("\n").forEach(function(a) {
        var line = a.split("=");
        if(!result[line[0]]) {
            result[line[0]] = [];
        }
        result[line[0]].push(line[1])
    });
    return result;
}

// remove an existent tree, if the new one has the same initial position
function checkTreePosition(treeInitialPosition){
    for(let id in treeID) {
        if (treeID[id].equals(treeInitialPosition)) {
            let treeToRemove = scene.getObjectByProperty('uuid', id);
            scene.remove(treeToRemove);
            delete treeID[id];
            break;
        }
    }
}

// derive the final string from axiom, iteration and rules
function treeStringDerivation(treeInfo, ruleArray){
    // initialize treeString as the initial tree axiom
    let treeString = treeInfo.axiom;

    // loop on number of iterations
    for(var i = 0; i < parseInt(treeInfo.iterations); i++) {
        var tmpString = "";
        // loop on treeString length at i-th iteration
        for(var j = 0; j < treeString.length; j++) {
            var char = treeString.charAt(j);
            var rule = ruleArray[char];
            // if some rules exist, the selected char is a L-system grammar variable (deterministic/stochastic case)
            // if not, the selected char is a L-system grammar constant
            if(rule !== undefined) {
                if(rule.length===1) {
                    tmpString += ruleArray[char][0];
                } else {
                    var vote = Math.floor(Math.random() * rule.length);
                    tmpString += ruleArray[char][vote];
                }
            } else {
                tmpString += char;
            }
        }
        treeString = tmpString;
    }
    return treeString;

}

// build tree structure from final derived string
function buildTreeFromString(treeString, treeInfo, treeInitialPosition){
    let treeInitialStatus = initTreeStatus(treeInfo, treeInitialPosition);
    let stackState = [treeInitialStatus];

    for(var i = 0; i < treeString.length; i++) {
        var char = treeString.charAt(i);
        if(char === "F") {
            let treeStatus = stackState[stackState.length-1];
            barkTotalGeometry.mergeMesh(buildBranch(treeStatus, treeInfo));
            continue;
        }
        if(char === "X") {
            let treeStatus = stackState[stackState.length-1];
            leafTotalGeometry.mergeMesh(buildLeaf(treeStatus, treeInfo.preset));

            continue;
        }
        if(char === "+") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), treeInfo.delta * toRad));
            continue;
        }
        if(char === "-") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -treeInfo.delta * toRad));
            continue;
        }
        if(char === "<") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -treeInfo.delta * toRad));
            continue;
        }
        if(char === ">") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), treeInfo.delta * toRad));
            continue;
        }
        if(char === "^") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -treeInfo.delta * toRad));
            continue;
        }
        if(char === "v") {
            let treeStatus = stackState[stackState.length-1];
            treeStatus.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), treeInfo.delta * toRad));
            continue;
        }
        if(char === "[") {
            let treeStatus = stackState[stackState.length-1];
            let treeStatusCopy = cloneTreeStatus(treeStatus);
            stackState.push(treeStatusCopy);
            continue;
        }

        // sistemare con variabili "stato" e copie sicure
        if(char === "]") {
            stackState.pop();
        }
    }
}

// clone treeStatus
function cloneTreeStatus(treeStatus) {
    return {
        bRadius : treeStatus.bRadius,
        bLength : treeStatus.bLength,
        bScale : treeStatus.bScale,
        currentPosition : new THREE.Vector3().copy(treeStatus.currentPosition),
        rotation : new THREE.Quaternion().copy(treeStatus.rotation)
    }
}

function buildBranch(treeStatus, treeInfo) {
    var position = new THREE.Vector3(0.0, treeStatus.bLength/2.1, 0.0);
    position.applyQuaternion(treeStatus.rotation);
    treeStatus.currentPosition.add(position);

    var branchG = branchGeometry.clone();
    //branchG = branchG.scale(treeStatus.bScale, treeStatus.bScale, treeStatus.bScale);
    var branch = new THREE.Mesh(branchG);

    branch.scale.set(treeStatus.bScale, treeStatus.bScale, treeStatus.bScale);
    branch.quaternion.copy(treeStatus.rotation);
    branch.position.copy(treeStatus.currentPosition);
    treeStatus.currentPosition.add(position);

    // bRadius reduction
    if ((treeStatus.bRadius - treeInfo.branchReduction*treeStatus.bRadius) >= treeInfo.branchMinRadius){
        treeStatus.bRadius = (treeStatus.bRadius - treeInfo.branchReduction*treeStatus.bRadius);
    }
    // bLength reduction
    if ((treeStatus.bLength - treeInfo.branchReduction*treeStatus.bLength) > 0){
        treeStatus.bLength = (treeStatus.bLength - treeInfo.branchReduction*treeStatus.bLength);
    }

    // bScale update
    if ((treeStatus.bScale - treeInfo.branchReduction*treeStatus.bScale) > 0){
        treeStatus.bScale = treeStatus.bScale - treeInfo.branchReduction*treeStatus.bScale;
    }

    branch.castShadow=true;
    branch.receiveShadow = true;

    return branch;
}

function buildLeaf(treeStatus, preset) {
    let angle = Math.random()*2*Math.PI;
    var leafPosition = new THREE.Vector3().copy(treeStatus.currentPosition);
    leafPosition.add(new THREE.Vector3(treeStatus.bRadius*Math.sin(angle)*0.7, 0.0, treeStatus.bRadius*Math.cos(angle)*0.7));

    if(preset < 3) {
        var leafG = leafGeometries[0].clone();
        var leaf = new THREE.Mesh(leafG);
        leaf.scale.set(0.2, 0.2, 0.2);
    }else if(preset < 5){
        var leafG = leafGeometries[0].clone();
        var leaf = new THREE.Mesh(leafG);
        leaf.scale.set(0.2, 0.12, 0.2);
    }else {
        var leafG = leafGeometries[1].clone();
        //leafG.scale(0.15, 0.2, 0.15);
        var leaf = new THREE.Mesh(leafG);
}
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.random()*Math.PI/2));
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random()*2*Math.PI));
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.random()*Math.PI/2));

    leaf.position.copy(leafPosition);

    leaf.castShadow= true;
    return leaf;
}


