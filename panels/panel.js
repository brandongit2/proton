var scaleTop = false;
var scaleRight = false;
var scaleBottom = false;
var scaleLeft = false;
var movePanel = false;
var scaleObject = null;
var scaleLoop = null; // A setInterval() used for resizing panels

function panelClicked(event, clickables) {
    for (var clickable of clickables) {
        if (clickable.tagName === "DIV") {
            clickableRect = clickable.getBoundingClientRect();
            if (event.clientX >= clickableRect.left && event.clientX <= clickableRect.right && event.clientY >= clickableRect.top && event.clientY <= clickableRect.bottom) {
                if ($(clickable).hasClass("edge top")) {
                    scaleTop = true;
                }
                if ($(clickable).hasClass("edge right")) {
                    scaleRight = true;
                }
                if ($(clickable).hasClass("edge bottom")) {
                    scaleBottom = true;
                }
                if ($(clickable).hasClass("edge left")) {
                    scaleLeft = true;
                }
                if ($(clickable).hasClass("handle")) {
                    movePanel = true;
                }
            }
        }
    }
    scaleObject = document.getElementById(event.target.id);
    var originalHeight = scaleObject.offsetHeight;
    var originalWidth = scaleObject.offsetWidth;
    var originalXPos = matrixToArray(scaleObject.style.transform)[0];
    var originalYPos = matrixToArray(scaleObject.style.transform)[1];
    var originalMouseY = mouseY;
    var originalMouseX = mouseX;

    var newHeight = 0;
    var newWidth = 0;
    var newXPos = null;
    var newYPos = null;
    console.log("SET INTERVAL");
    scaleLoop = setInterval(function () {
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
                        scaleObject.style.width = newWidth + "px";
                    }
                }
            }
            scaleObject.style.transform = "translate(" + (newXPos == null ? originalXPos : newXPos) + "px, " + (newYPos == null ? originalYPos : newYPos) + "px)";
        }
    }, 10);
    event.target.addEventListener("mouseup", stopScale);
}

var stopScale = function () {
    console.log("CLEARED");
    scaleTop = scaleRight = scaleBottom = scaleLeft = movePanel = false;
    clearInterval(scaleLoop);
    removeEventListener("mouseup", stopScale);
};