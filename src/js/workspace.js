(function() {
    const SPACE_BETWEEN_DOTS = 40;
    const SCALE_FACTOR       = 1.2;  // Scale factor of 2 makes everything twice as big, 0.5 makes everything half as big, etc.
    const SCALE_LENGTH       = 0.15; // How long (in seconds) the zoom animation lasts
    const MAX_ZOOM           = 15;
    const MIN_ZOOM           = 0.5;
    const INERTIA_LENGTH     = 0.7;  // How long (in seconds) inertia lasts
    const INERTIA_DISTANCE   = 6;    // Multiplied by mouse movement delta to determine how far to go
    var workspace   = null;
    var ctx         = null;
    var doPan       = false;
    var w = {
        origin:      {x: 0, y: 0},
        velocity:    {x: 0, y: 0},
        scale:       1,
        targetScale: 1
    };

    /**
     * Initializes the workspace.
     */
    window.createWorkspace = function() {
        workspace = document.getElementById('workspace');
        ctx       = workspace.getContext('2d');

        workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
        workspace.height = document.getElementById('content').offsetHeight;

        w.origin.x = workspace.width / 2;
        w.origin.y = workspace.height / 2;
        ctx.translate(Math.floor(w.origin.x) + 0.5, Math.floor(w.origin.y) + 0.5);

        var inertiaLoop = null; // Is actually a TweenMax
        var toolsWidth  = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
        workspace.addEventListener("mousedown", function(event) {
            event.preventDefault();
            TweenMax.to("#color-dummy", 0.3, {color: '#9d9d9d'});

            if (inertiaLoop != null) {
                inertiaLoop.kill();
                inertiaLoop = null;
            }

            doPan = true;
        });

        var stopPan = function(event) {
            if (doPan) {
                if (event.type == "mouseup") {
                    inertiaLoop = TweenMax.to(w.origin, INERTIA_LENGTH, {x: w.origin.x + w.velocity.x * INERTIA_DISTANCE, y: w.origin.y + w.velocity.y * INERTIA_DISTANCE, ease: Expo.easeOut});
                }

                TweenMax.to("#color-dummy", 0.3, {color: '#cfcfcf'});
                doPan = false;
            }
        };

        window.addEventListener("mouseup", stopPan);
        window.addEventListener("mouseout", stopPan);

        var prevScale = w.scale;
        setInterval(function() {
            w.origin.x += (mouseX - toolsWidth) / w.scale - (mouseX - toolsWidth) / prevScale;
            w.origin.y += mouseY / w.scale - mouseY / prevScale;
            ctx.setTransform(w.scale, 0, 0, w.scale, Math.floor(w.origin.x * w.scale) + 0.5, Math.floor(w.origin.y * w.scale) + 0.5);
            renderDots();
            prevScale = w.scale;
        }, 10);

        var prevScrollDirection = 0;
        workspace.addEventListener("wheel", function(e) {
            if (prevScrollDirection != Math.sign(e.deltaY)) {
                w.targetScale = w.scale;
            }
            if (inertiaLoop != null) {
                inertiaLoop.kill();
                inertiaLoop = null;
            }
            prevScrollDirection = Math.sign(e.deltaY);
            w.targetScale *= e.deltaY > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR; // Determine which way to zoom
            // Enforce zoom limits
            if (w.targetScale > MAX_ZOOM) {
                w.targetScale = MAX_ZOOM;
            } else if (w.targetScale < MIN_ZOOM) {
                w.targetScale = MIN_ZOOM;
            }

            if (zoomAnimation != null) {
                zoomAnimation.kill();
                zoomAnimation = null;
                prevScale = w.scale;
            }
            var zoomAnimation = TweenMax.to(w, SCALE_LENGTH, {scale: w.targetScale});
        });
    }

    /**
     * Is called by a mousemove listener in ui.js in order to synchronize moving the mouse with moving the workspace.
     * Pans the workspace.
     */
    window.pan = function() {
        if (doPan) {
            w.origin.x += deltaX / w.scale;
            w.origin.y += deltaY / w.scale;
            w.velocity.x = deltaX / w.scale;
            w.velocity.y = deltaY / w.scale;
            ctx.setTransform(w.scale, 0, 0, w.scale, Math.floor(w.origin.x * w.scale) + 0.5, Math.floor(w.origin.y * w.scale) + 0.5);
        }
    }

    /**
     * Renders dots.
     */
    var renderDots = function() {
        var toolsWidth = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
        ctx.strokeStyle = $('#color-dummy').css('color');
        ctx.clearRect(-w.origin.x, -w.origin.y - 1, workspace.width / w.scale, workspace.height / w.scale + 1);
        ctx.fillRect(-5, -5, 10, 10);

        for (var i = Math.floor(-w.origin.x / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; i < Math.floor(-w.origin.x / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS + workspace.width / w.scale + 2 * SPACE_BETWEEN_DOTS; i += SPACE_BETWEEN_DOTS) {
            for (var j = Math.floor(-w.origin.y / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; j < Math.floor(-w.origin.y / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS + workspace.height / w.scale + 2 * SPACE_BETWEEN_DOTS; j += SPACE_BETWEEN_DOTS) {
                ctx.beginPath();
                ctx.moveTo(i - 2, j);
                ctx.lineTo(i + 2, j);
                ctx.moveTo(i, j - 2);
                ctx.lineTo(i, j + 2);
                ctx.stroke();
            }
        }
    }
})(window);
