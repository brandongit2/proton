var scaleLoop = null; // A setInterval() used for resizing panels
const SNAP_RADIUS    = 20;
const TOOLBAR_HEIGHT = 20;
const MIN_PANEL_SIZE = 30;

function resizePanel(panel, directions, originals) {
    for (var i = 0; i < originals.length; i++) {
        originals[i] = parseInt(originals[i]);
    }

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

            // snap to top edge
            newTop  = newTop < SNAP_RADIUS && newTop > -SNAP_RADIUS ? 0 : newTop;

            // snap to left edge
            newLeft = newLeft < SNAP_RADIUS && newLeft > -SNAP_RADIUS ? 0 : newLeft;

            // snap to bottom edge
            if (newTop + newHeight + TOOLBAR_HEIGHT > window.innerHeight - SNAP_RADIUS && newTop + newHeight + TOOLBAR_HEIGHT < window.innerHeight + SNAP_RADIUS) {
                newTop = window.innerHeight - TOOLBAR_HEIGHT - newHeight;
            }

            // snap to right edge
            if (newLeft + newWidth > window.innerWidth - SNAP_RADIUS && newLeft + newWidth < window.innerWidth + SNAP_RADIUS) {
                newLeft = window.innerWidth - newWidth;
            }

        } else {
            reflowItems();
            if (directions[0]) { // Scale top
                potentialNewTop = mouseY - (originals[1] - originals[4]);
                newTop          = potentialNewTop > originals[4] + originals[3] - MIN_PANEL_SIZE ? originals[4] + originals[3] - MIN_PANEL_SIZE : potentialNewTop;

                // snap to top edge
                if (newTop < SNAP_RADIUS && newTop > -SNAP_RADIUS) {
                    newHeight = originals[3] - (mouseY - originals[1]) + newTop;
                    newTop = 0;
                } else {
                    newHeight = originals[3] - (mouseY - originals[1]);
                }
            }
            if (directions[1]) { // Scale right
                newWidth = mouseX - originals[0] + originals[2];

                // snap to right edge
                if (newWidth + newLeft > window.innerWidth - SNAP_RADIUS && newWidth + newLeft < window.innerWidth + SNAP_RADIUS) {
                    newWidth = window.innerWidth - newLeft;
                }
            }
            if (directions[2]) { // Scale bottom
                newHeight = mouseY - originals[1] + originals[3];

                // snap to bottom edge
                if (newHeight + newTop + TOOLBAR_HEIGHT > window.innerHeight - SNAP_RADIUS && newHeight + newTop + TOOLBAR_HEIGHT < window.innerHeight + SNAP_RADIUS) {
                    newHeight = window.innerHeight - TOOLBAR_HEIGHT - newTop;
                }
            }
            if (directions[3]) { // Scale left
                potentialNewLeft = mouseX - (originals[0] - originals[5]);
                newLeft          = potentialNewLeft > originals[5] + originals[2] - MIN_PANEL_SIZE ? originals[5] + originals[2] - MIN_PANEL_SIZE : potentialNewLeft;

                // snap to left edge
                if (newLeft < SNAP_RADIUS && newLeft > -SNAP_RADIUS) {
                    newWidth = originals[2] - (mouseX - originals[0]) + newLeft;
                    newLeft = 0;
                } else {
                    newWidth = originals[2] - (mouseX - originals[0]);
                }
            }
        }

        // Keep panels from going off the edge of the screen
        if (newLeft > window.innerWidth - 10) {
            newLeft = window.innerWidth - 10;
        } else if (newLeft + newWidth < 10) {
            newLeft = 10 - newWidth;
        }
        if (newTop > window.innerHeight - 30) {
            newTop = window.innerHeight - 30;
        } else if (newTop < TOOLBAR_HEIGHT - 20) {
            newTop = TOOLBAR_HEIGHT - 20;
        }
        panel.style.transform = "translate(" + newLeft + "px, " + newTop + "px)";
        panel.style.width     = newWidth + "px";
        panel.style.height    = newHeight + "px";
    }, 10);
}

var stopScale = function () {
    clearInterval(scaleLoop);
    removeEventListener("mouseup", stopScale);
};
