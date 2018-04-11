var scaleLoop = null; // A setInterval() used for resizing panels

function resizePanel(panel, directions) {
    /*
     * directions = [top, right, bottom, left]
     * where each element is a boolean indicatin whether or not to scale the panel in that direction.
     */

    window.addEventListener("mouseup", stopScale);

    var newTop    = 0;
    var newLeft   = 0;
    var newWidth  = 0;
    var newHeight = 0;
    scaleLoop = setInterval(function() {
        if (directions[0]) {
            console.log("scale top");
        }
        if (directions[1]) {
            console.log("scale right");
        }
        if (directions[2]) {
            console.log("scale bottom");
        }
        if (directions[3]) {
            console.log("scale left");
        }

        // panel.style.transform = whatever;
        // panel.style.width     = whatever;
        // panel.style.height    = whatever;
    }, 10);
}
//
// function panelClicked(e, clickables) {
//     scaleObject = e.target.id;
//     console.log(scaleObject);
//     for (var clickable of clickables) {
//         if (clickable.tagName === "DIV") {
//             clickableRect = clickable.getBoundingClientRect();
//             if (e.clientX >= clickableRect.left && e.clientX <= clickableRect.right && e.clientY >= clickableRect.top && e.clientY <= clickableRect.bottom) {
//                 if ($(clickable).hasClass("edge top")) {
//                     scaleTop = true;
//                 }
//                 if ($(clickable).hasClass("edge right")) {
//                     scaleRight = true;
//                 }
//                 if ($(clickable).hasClass("edge bottom")) {
//                     scaleBottom = true;
//                 }
//                 if ($(clickable).hasClass("edge left")) {
//                     scaleLeft = true;
//                 }
//                 if ($(clickable).hasClass("handle")) {
//                     movePanel = true;
//                 }
//             }
//         }
//     }
//     scaleObject = document.getElementById(e.target.id);
//     var originalHeight = scaleObject.offsetHeight;
//     var originalWidth = scaleObject.offsetWidth;
//     var originalXPos = matrixToArray(scaleObject.style.transform)[0];
//     var originalYPos = matrixToArray(scaleObject.style.transform)[1];
//     var originalMouseY = mouseY;
//     var originalMouseX = mouseX;
//
//     var newHeight = 0;
//     var newWidth = 0;
//     var newXPos = null;
//     var newYPos = null;
//     console.log("SET INTERVAL");
//     scaleLoop = setInterval(function() {
//         if (mouseY > 0) {
//             newXPos = null;
//             newYPos = null;
//             if (movePanel) {
//                 newXPos = mouseX - (originalMouseX - originalXPos);
//                 newYPos = mouseY - (originalMouseY - originalYPos);
//             } else {
//                 if (scaleTop) {
//                     newHeight = originalHeight - (mouseY - originalMouseY);
//                     if (newHeight > 30) {
//                         newYPos = mouseY;
//                         scaleObject.style.height = newHeight + "px";
//                     }
//                 }
//                 if (scaleRight) {
//                     newWidth = mouseX - originalXPos;
//                     if (newWidth > 30) {
//                         scaleObject.style.width = newWidth + "px";
//                     }
//                 }
//                 if (scaleBottom) {
//                     newHeight = mouseY - originalYPos;
//                     if (newHeight > 30) {
//                         scaleObject.style.height = newHeight + "px";
//                     }
//                 }
//                 if (scaleLeft) {
//                     newWidth = originalWidth - (mouseX - originalMouseX);
//                     if (newWidth > 30) {
//                         newXPos = mouseX;
//                         scaleObject.style.width = newWidth + "px";
//                     }
//                 }
//             }
//             scaleObject.style.transform = "translate(" + (newXPos == null ? originalXPos : newXPos) + "px, " + (newYPos == null ? originalYPos : newYPos) + "px)";
//         }
//     }, 10);
//     window.addEventListener("mouseup", stopScale);
// }
//
var stopScale = function () {
    console.log("CLEARED");
    clearInterval(scaleLoop);
    removeEventListener("mouseup", stopScale);
};
