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
    var movePanel   = false;
    var scaleObject = null;
    var scaleLoop   = null; // A setInterval() used for resizing panels

    var stopScale   = function() {
        scaleTop = scaleRight = scaleBottom = scaleLeft = movePanel = false;
        clearInterval(scaleLoop);
        removeEventListener("mouseup", stopScale);
    };

    window.addEventListener("mousemove", function(e) {
        mouseX = e.x;
        mouseY = e.y - 20; // 20 is the toolbar height
    });

    window.addEventListener("mousedown", function(e) {
        if (e.originalTarget.matches(".edge") || e.originalTarget.matches(".handle")) {
            if (e.originalTarget.matches(".edge.top")) {
                scaleTop = true;
            }
            if (e.originalTarget.matches(".edge.right")) {
                scaleRight = true;
            }
            if (e.originalTarget.matches(".edge.bottom")) {
                scaleBottom = true;
            }
            if (e.originalTarget.matches(".edge.left")) {
                scaleLeft = true;
            }
            if (e.originalTarget.matches(".handle")) {
                movePanel = true;
            }

            scaleObject = document.getElementById(e.target.id);
            var originalHeight = scaleObject.offsetHeight;
            var originalWidth  = scaleObject.offsetWidth;
            var originalXPos   = matrixToArray(scaleObject.style.transform)[0];
            var originalYPos   = matrixToArray(scaleObject.style.transform)[1];
            var originalMouseY = mouseY;
            var originalMouseX = mouseX;

            var newHeight = 0;
            var newWidth  = 0;
            var newXPos   = null;
            var newYPos   = null;
            scaleLoop = setInterval(function() {
                if (mouseY > 0) {
                    if (movePanel) {
                        newXPos = mouseX - (originalMouseX - originalXPos);
                        newYPos = mouseY - (originalMouseY - originalYPos);
                    } else {
                        if (scaleTop) {
                            newHeight = originalHeight - (mouseY - originalMouseY);
                            if (newHeight > 30) {
                                newYPos = mouseY;
                                scaleObject.style.height = newHeight + "px";
                            }
                        }
                        if (scaleRight) {
                            newWidth = mouseX - originalXPos;
                            if (newWidth > 30) {
                                scaleObject.style.width = newWidth + "px";
                            }
                        }
                        if (scaleBottom) {
                            newHeight = mouseY - originalYPos;
                            if (newHeight > 30) {
                                scaleObject.style.height = newHeight + "px";
                            }
                        }
                        if (scaleLeft) {
                            newWidth = originalWidth - (mouseX - originalMouseX);
                            if (newWidth > 30) {
                                newXPos = mouseX;
                                scaleObject.style.width     = newWidth + "px";
                            }
                        }
                    }
                    scaleObject.style.transform = "translate(" + (newXPos == null ? originalXPos : newXPos) + "px, " + (newYPos == null ? originalYPos : newYPos) + "px)";
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
