var layout = null;
var panels = null;

var mouseX = 0;
var mouseY = 0;

$(function() {
    // Obtain JSON files
    var request1 = new XMLHttpRequest();
    request1.responseType = "json";
    request1.open("GET", "default.math");
    request1.send();
    request1.onload = function() {
        layout = request1.response;
        setLayout();
    }

    window.addEventListener("mousemove", function(e) {
        mouseX = e.x;
        mouseY = e.y - 20; // 20 is the toolbar height
    });
});

function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
}

function setLayout() {
    var workspace = layout.workspace;
    var workspaceElement = document.getElementById("workspace");
    var wWidth  = workspaceElement.offsetWidth;
    var wHeight = workspaceElement.offsetHeight;
    var percentWidth  = wWidth / 100;
    var percentHeight = wHeight / 100;
    for (var panel in workspace) {
        var properties   = workspace[panel]["properties"];
        var panelElement = document.createElement("math-panel");
        panelElement.setAttribute("id", panel);
        panelElement.style.height    = properties["height"] * percentHeight + "px";
        panelElement.style.width     = properties["width"] * percentWidth + "px";
        panelElement.style.transform = "translate(" + (properties["xPos"] * percentWidth + "px") + ", " + (properties["yPos"] * percentHeight + "px") + ")";
        panelElement.setAttribute("orientation", properties["orientation"]);
        workspaceElement.appendChild(panelElement);
    }
    setUpCanvas();
}
