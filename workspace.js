var layout = null;

$(function() {
    // Obtain JSON files
    var request1 = new XMLHttpRequest();
    request1.responseType = "json";
    request1.open("GET", "default.math");
    request1.send();
    request1.onload = function() {
        layout = request1.response;
        setLayout();
        window.addEventListener("resize", function() {
            var percentWidth  = document.getElementById("workspace").offsetWidth / 100;
            var percentHeight  = document.getElementById("workspace").offsetHeight / 100;
            for (var panel in layout.workspace) {
                var properties   = layout.workspace[panel]["properties"];
                var panelElement = document.getElementById(panel);
                panelElement.style.height = properties["height"] * percentHeight + "px";
                panelElement.style.width  = properties["width"] * percentWidth + "px";
                panelElement.style.top    = properties["yPos"] * percentHeight + "px";
                panelElement.style.left   = properties["xPos"] * percentWidth + "px";
            }
        });

        enableMovement();
    }
});

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
        panelElement.style.height = properties["height"] * percentHeight + "px";
        panelElement.style.width  = properties["width"] * percentWidth + "px";
        panelElement.style.top    = properties["yPos"] * percentHeight + "px";
        panelElement.style.left   = properties["xPos"] * percentWidth + "px";
        panelElement.setAttribute("orientation", properties["orientation"]);
        workspaceElement.appendChild(panelElement);
    }
}

function enableMovement() {
    var panels = document.querySelectorAll("math-panel")[0];
    console.log(panels);
    // for (var panel in panels) {
    //     console.log(panels[panel]);
    // }
}
