function enableBuildButton()
{
    var selectPreset = document.getElementById('preset');
    var button = document.getElementById('renderbutton');
    button.disabled = !selectPreset.value;
}

function collapseModMenu() {
    var content = document.getElementById("modmenu");
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function collapseAdvMenu() {
    var content = document.getElementById("advmenu");
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

