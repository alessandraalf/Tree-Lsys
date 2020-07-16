let presets = [
    {
        name: 'Tree A',
        axiom: 'FFFA',
        rules: 'A=F[++AX][--AX]>>>A\nA=F[+++AX][-AX]<<A\nA=A',
        iterations: 6,
        delta: 25,
        branchLength: 5,
        branchRadius: 1,
        branchReduction: '0.17',
        branchMinRadius: 0.1
    },
    {
        name: 'Tree B',
        axiom: 'FA',
        rules: 'A=F[^BX]>>[^BX]>>A\nA=F[vBX]<<[vBX]<<A\nA=F[vBX]<<<<A\nB=F[-BX]B\nB=FXB',
        iterations: 10,
        delta: 30,
        branchLength: 5,
        branchRadius: 0.8,
        branchReduction: 0.12,
        branchMinRadius: 0.1
    },
    {
        name: 'Tree C',
        axiom: 'FA',
        rules: 'A=^FB>>>B>>>>>B\nA=FB>>>>>>>>B\nA=vF>>>>>>>>B\nB=[^^F>>>>>>A]',
        iterations: 10,
        delta: 15,
        branchLength: 6,
        branchRadius: 0.4,
        branchReduction: 0.15,
        branchMinRadius: 0.1
    },
    {
        name: 'Bush A',
        axiom: 'FFFFFA',
        rules: 'A=[BXX]>>>>[BXX]>>>>[BXX]\nB=vFXXFXXFXXAXXX',
        iterations: 10,
        delta: 60,
        branchLength: 1,
        branchRadius: 0.3,
        branchReduction: 0.05,
        branchMinRadius: 0.1
    },
    {
        name: 'Bush B',
        axiom: 'A',
        rules: 'A=[vFXA]>>>>>[vFXA]>>>>>>>[vFXA]\nF=S>>>>>F\nS=FX',
        iterations: 6,
        delta: 22.5,
        branchLength: 1,
        branchRadius: 0.2,
        branchReduction: 0.05,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree A',
        axiom: 'F',
        rules: 'F=F[+F]F[-F]F',
        iterations: 5,
        delta: 25.7,
        branchLength: 3,
        branchRadius: 0.5,
        branchReduction: 0.07,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree B',
        axiom: 'F',
        rules: 'F=F[+F]F[-F][F]',
        iterations: 5,
        delta: 20,
        branchLength: 5,
        branchRadius: 0.5,
        branchReduction: 0.1,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree C',
        axiom: 'F',
        rules: 'F=FF-[-F+F+F]+[+F-F-F]',
        iterations: 4,
        delta: 22.5,
        branchLength: 4.5,
        branchRadius: 0.6,
        branchReduction: 0.1,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree D',
        axiom: 'X',
        rules: 'X=F[+X]F[-X]+X\nF=FF',
        iterations: 7,
        delta: 20,
        branchLength: 0.5,
        branchRadius: 1,
        branchReduction: 0.01,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree E',
        axiom: 'X',
        rules: 'X=F[+X][-X]FX\nF=FF',
        iterations: 7,
        delta: 25.7,
        branchLength: 0.5,
        branchRadius: 1,
        branchReduction: 0.01,
        branchMinRadius: 0.1
    },
    {
        name: 'Common Tree F',
        axiom: 'X',
        rules: 'X=F-[[X]+X]+F[+FX]-X\nF=FF',
        iterations: 5,
        delta: 22.5,
        branchLength: 2.5,
        branchRadius: 1,
        branchReduction: 0.06,
        branchMinRadius: 0.1
    },

];

var select = document.getElementById("preset");
for(index in presets) {
    select.options[select.options.length] = new Option(presets[index].name, index);
}


//change parameters in html form based on #preset select option selected
function changePreset() {
    let preset = $("#preset").val();
    let treeSettings = new TreeSettings(presets[preset]);
    $("#axiom").val(treeSettings.axiom);
    $("#rules").val(treeSettings.rules);
    $("#iterations").val(treeSettings.iterations);
    $("#delta").val(treeSettings.delta);
    $("#branchLength").val(treeSettings.branchLength);
    $("#branchRadius").val(treeSettings.branchRadius);
    $("#branchReduction").val(treeSettings.branchReduction);
    $("#branchMinRadius").val(treeSettings.branchMinRadius);
}