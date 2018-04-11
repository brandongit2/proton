var scaleLoop = null; // A setInterval() used for resizing panels

function resizePanel(panel, directions, originals) {
    /* directions = [top, right, bottom, left]
     * where each element is a boolean indicating whether or not to scale the panel in that direction.
     */

    /*
     * originals = [mouseX, mouseY, panelWidth, panelHeight, panelTop, panelLeft]
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
                newHeight = originals[3] - (mouseY - originals[1]);
                newTop    = mouseY - (originals[1] - originals[4]);
            }
            if (directions[1]) { // Scale right
                newWidth = mouseX - originals[0] + originals[2];
            }
            if (directions[2]) { // Scale bottom
                newHeight = mouseY - originals[1] + originals[3];
            }
            if (directions[3]) { // Scale left
                newWidth = originals[2] - (mouseX - originals[0]);
                newLeft  = mouseX - (originals[0] - originals[5]);
                console.log(newLeft, parseInt(originals[2]) + parseInt(originals[5]) - parseInt($(panel).css("min-width")));
                if (newLeft > parseInt(originals[2]) + parseInt(originals[5]) - parseInt($(panel).css("min-width"))) {
                    console.log("TOO FAR!");
                }
            }
        }

        panel.style.transform = "translate(" + (newLeft > window.innerWidth - 10 ? window.innerWidth - 10 : newLeft) + "px, " + (newTop > window.innerHeight - 30 ? window.innerHeight - 30 : newTop) + "px)";
        panel.style.width     = (newWidth < 30 ? 30 : newWidth) + "px";
        panel.style.height    = (newHeight < 30 ? 30 : newHeight) + "px";
    }, 10);
}

var stopScale = function () {
    clearInterval(scaleLoop);
    removeEventListener("mouseup", stopScale);
};
