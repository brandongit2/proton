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

        
            // snap to top edge
            newTop  = newTop < 20 && newTop > -20 ? 0 : newTop;
            
            // snap to left edge
            newLeft = newLeft < 20 && newLeft > -20 ? 0 : newLeft;
            
            // snap to bottom edge
            if (newTop + newHeight + 20 > window.innerHeight - 20 && newTop + newHeight + 20 < window.innerHeight + 20) {
                newTop = window.innerHeight - 20 - newHeight;
            }

            // snap to right edge
            if (newLeft + newWidth > window.innerWidth - 20 && newLeft + newWidth < window.innerWidth + 20) {
                newLeft = window.innerWidth - newWidth;
            }

        } else {
            if (directions[0]) { // Scale top
                potentialNewTop = mouseY - (originals[1] - originals[4]);
                newTop          = potentialNewTop > originals[4] + originals[3] - 30 ? originals[4] + originals[3] - 30 : potentialNewTop;

                // snap to top edge
                if (newTop < 20 && newTop > -20) {
                    newHeight = originals[3] - (mouseY - originals[1]) + newTop;
                    newTop = 0;
                } else {
                    newHeight = originals[3] - (mouseY - originals[1]);
                }
            }
            if (directions[1]) { // Scale right
                newWidth = mouseX - originals[0] + originals[2];

                // snap to right edge
                if (newWidth + newLeft > window.innerWidth - 20 && newWidth + newLeft < window.innerWidth + 20) {
                    newWidth = window.innerWidth - newLeft;
                }
            }
            if (directions[2]) { // Scale bottom
                newHeight = mouseY - originals[1] + originals[3];

                // snap to bottom edge
                if (newHeight + newTop + 20 > window.innerHeight - 20 && newHeight + newTop + 20 < window.innerHeight + 20) {
                    newHeight = window.innerHeight - 20 - newTop;
                }
            }
            if (directions[3]) { // Scale left
                potentialNewLeft = mouseX - (originals[0] - originals[5]);
                newLeft          = potentialNewLeft > originals[5] + originals[2] - 30 ? originals[5] + originals[2] - 30 : potentialNewLeft;

                // snap to left edge
                if (newLeft < 20 && newLeft > -20) {
                    newWidth = originals[2] - (mouseX - originals[0]) + newLeft;
                    newLeft = 0;
                } else {
                    newWidth = originals[2] - (mouseX - originals[0]);
                }
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
