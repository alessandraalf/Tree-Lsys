let tree;

// associative array {tree 'uuid' : tree position in the scene}
let treeID = [];

// initialize wood and leaf material
let woodMaterial = woodGraphicInfo();
let leafMaterial = leafGraphicInfo();

// define leaf geometry
let leafGeometry = [buildLeafGeometry(0.3), buildLeafGeometry(1)];

let mouseClick;
const toRad = Math.PI/180;


function buildTree() {
    let treeInfo = getTreeSettings();

    let rules = ruleToArray(treeInfo.rules);

    let treeString = treeStringDerivation(treeInfo, rules);
    console.log("treeString", treeString);

    tree = new THREE.Object3D();
    let treeInitialPosition = (scene.getObjectByName('mouseClick') !== undefined) ?
        scene.getObjectByName('mouseClick').position : new THREE.Vector3( 0, 0, 0 );
    checkTreePosition(treeInitialPosition);

    buildTreeFromString(treeString, treeInfo);

    // activate shadows
    tree.castShadow = true;
    tree.receiveShadow = true;

    scene.add(tree);

    treeID[tree.uuid] = treeInitialPosition;

    if (scene.getObjectByName('mouseClick') !== undefined){
        scene.remove(scene.getObjectByName('mouseClick'));
        circleMesh = null;
    }
    render();
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
function initTreeStatus(treeInfo) {
    return {
        bRadius : treeInfo.branchRadius,
        bLength : treeInfo.branchLength,

        currentPosition : (scene.getObjectByName('mouseClick') !== undefined) ?
            scene.getObjectByName('mouseClick').position : new THREE.Vector3( 0, 0, 0 ),
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
    for(var id in treeID) {
        if (treeID[id].equals(treeInitialPosition)) {
            var treeToRemove = scene.getObjectByProperty('uuid', id);
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
function buildTreeFromString(treeString, treeInfo){
    let treeInitialStatus = initTreeStatus(treeInfo);
    let stackState = [treeInitialStatus];

    for(var i = 0; i < treeString.length; i++) {
        var char = treeString.charAt(i);
        if(char === "F") {
            let treeStatus = stackState[stackState.length-1];
            tree.add(buildBranch(treeStatus, treeInfo));
            continue;
        }
        if(char === "X") {
            let treeStatus = stackState[stackState.length-1];
            tree.add(buildLeaf(treeStatus, treeInfo.preset));
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
        currentPosition : new THREE.Vector3().copy(treeStatus.currentPosition),
        rotation : new THREE.Quaternion().copy(treeStatus.rotation)
    }
}

function buildBranch(treeStatus, treeInfo) {
    var position = new THREE.Vector3(0.0, treeStatus.bLength/2.1, 0.0);
    position.applyQuaternion(treeStatus.rotation);
    treeStatus.currentPosition.add(position);

    var branchGeometry = new THREE.CylinderBufferGeometry(treeStatus.bRadius*(1-treeInfo.branchReduction), treeStatus.bRadius, treeStatus.bLength, 16);
    var branch = new THREE.Mesh(branchGeometry, woodMaterial);
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

    branch.castShadow=true;
    branch.receiveShadow = true;

    return branch;
}


function buildLeaf(treeStatus, preset) {
    let angle = Math.random()*2*Math.PI;
    var leafPosition = new THREE.Vector3().copy(treeStatus.currentPosition);
    leafPosition.add(new THREE.Vector3(treeStatus.bRadius*Math.sin(angle), 0.0, treeStatus.bRadius*Math.cos(angle)));
    if(preset < 3){
        var leaf = new THREE.Mesh(leafGeometry[1], leafMaterial);
    }else {
        var leaf = new THREE.Mesh(leafGeometry[0], leafMaterial);
    }
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.random()*2*Math.PI));
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random()*2*Math.PI));
    leaf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.random()*2*Math.PI));

    leaf.position.copy(leafPosition);

    leaf.castShadow= true;
    leaf.receiveShadow = true;
    return leaf;
}


