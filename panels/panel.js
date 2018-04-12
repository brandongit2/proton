var scaleLoop = null; // A setInterval() used for resizing panels

function resizePanel(panel, directions, originals) {
    for (var i = 0; i < originals.length; i++) {
        originals[i] = parseInt(originals[i]);
    }

    /* directions = [top, right, bottom, left]
     * where each element is a boolean indicating whether or not to scale the panel in that direction.
     */

    /*
     * originals = {mouseX, mouseY, panelWidth, panelHeight, panelTop, panelLeft}
     * where all elements are set to their respective values at the beginning of the click.
     */

    window.addEventListener("mouseup", stopScale);

    var newTop    = originals[4];
    var newLeft   = originals[5];
    var newWidth  = originals[2];
    var newHeight = originals[3];
    scaleLoop = setInterval(function() {
        if (directions[0] == directions[1] && directions[1] == directions[2] && directions[2] == directions[3]) { // Move panel
            newTop  = mouseY - (originals[1] - originals[4]);
            newLeft = mouseX - (originals[0] - originals[5]);
        } else {
            if (directions[0]) { // Scale top
                newHeight       = originals[3] - (mouseY - originals[1]);
                potentialNewTop = mouseY - (originals[1] - originals[4]);
                newTop          = potentialNewTop > originals[4] + originals[3] - 30 ? originals[4] + originals[3] - 30 : potentialNewTop;
            }
            if (directions[1]) { // Scale right
                newWidth = mouseX - originals[0] + originals[2];
            }
            if (directions[2]) { // Scale bottom
                newHeight = mouseY - originals[1] + originals[3];
            }
            if (directions[3]) { // Scale left
                newWidth         = originals[2] - (mouseX - originals[0]);
                potentialNewLeft = mouseX - (originals[0] - originals[5]);
                newLeft          = potentialNewLeft > originals[5] + originals[2] - 30 ? originals[5] + originals[2] - 30 : potentialNewLeft;
            }
        }

        panel.style.transform = "translate(" + (newLeft > window.innerWidth - 10 ? window.innerWidth - 10 : newLeft) + "px, " + (newTop > window.innerHeight - 30 ? window.innerHeight - 30 : newTop) + "px)";
        panel.style.width     = newWidth + "px";
        panel.style.height    = newHeight + "px";
    }, 10);
}

var stopScale = function () {
    clearInterval(scaleLoop);
    removeEventListener("mouseup", stopScale);
};
