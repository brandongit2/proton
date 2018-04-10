var layout = null;
var panels = null;

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
    }

    var scaleTop    = false;
    var scaleRight  = false;
    var scaleBottom = false;
    var scaleLeft   = false;
    var scaleObject = null;
    var scaleLoop   = null; // A setInterval() used for resizing panels
    var mouseX      = 0;
    var mouseY      = 0;
    var stopScale   = function() {
        console.log("ENDING SCALE");
        clearInterval(scaleLoop);
        removeEventListener("mouseup", stopScale);
        removeEventListener("mousemove", updateMouseCoords);
    };
    var updateMouseCoords = function(e) {
        mouseX = e.x;
        mouseY = e.y - 20; // 20 is the toolbar height
    };

    window.addEventListener("mousedown", function(e) {
        if (e.originalTarget.matches(".edge")) {
            window.addEventListener("mousemove", updateMouseCoords);

            if (e.originalTarget.matches(".edge.top")) {
                scaleTop = true;
            }
            scaleObject = document.getElementById(e.target.id);
            scaleLoop = setInterval(function() {
                var originalHeight = scaleObject.offsetHeight;
                var originalxPos   = matrixToArray(scaleObject.style.transform)[0];
                var originalMouseY = mouseY;
                if (scaleTop && mouseY > 0) {
                    var newHeight = originalHeight - (mouseY - originalMouseY);
                    console.log(mouseY);
                    if (newHeight > 30) {
                        scaleObject.style.transform = "translate(" + originalxPos + "px, " + (mouseY - originalMouseY + "px") + ")";
                        scaleObject.style.height    = newHeight + "px";
                    }
                }
            }, 10);
            window.addEventListener("mouseup", stopScale);
        }
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
}
