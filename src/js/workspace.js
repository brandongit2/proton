(function() {
    const SPACE_BETWEEN_DOTS = 40;
    const MAX_ZOOM           = 15;
    const MIN_ZOOM           = 0.8;
    const SCALE_FACTOR       = 1.2;
    var workspace   = null;
    var ctx         = null;
    var w = {
        origin:      {x: 0, y: 0},
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
        ctx.translate(w.origin.x - 0.5, w.origin.y - 0.5);

        var panLoop        = null;
        var toolsWidth     = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
        workspace.addEventListener("mousedown", function() {
            TweenMax.to("#color-dummy", 0.3, {color: '#9d9d9d'});

            panLoop = setInterval(function() {
                w.origin.x += deltaX / w.scale;
                w.origin.y += deltaY / w.scale;
                ctx.setTransform(w.scale, 0, 0, w.scale, w.origin.x * w.scale + 0.5, w.origin.y * w.scale + 0.5);
            }, 10);
        });

        window.addEventListener("mouseup", function() {
            if (panLoop != null) {
                TweenMax.to("#color-dummy", 0.3, {color: '#cfcfcf'});
                clearInterval(panLoop);
            }
        });

        var prevScale = w.scale;
        setInterval(function() {
            w.origin.x += (mouseX - toolsWidth) / w.scale - (mouseX - toolsWidth) / prevScale;
            w.origin.y += mouseY / w.scale - mouseY / prevScale;
            ctx.setTransform(w.scale, 0, 0, w.scale, w.origin.x * w.scale + 0.5, w.origin.y * w.scale + 0.5);
            renderDots();
            prevScale = w.scale;
        }, 10);

        var prevScrollDirection = 0;
        workspace.addEventListener("wheel", function(e) {
            if (prevScrollDirection != Math.sign(e.deltaY)) {
                w.targetScale = w.scale;
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
                prevScale = w.scale;
            }
            var zoomAnimation = TweenMax.to(w, 0.15, {scale: w.targetScale});
        });
    }

    /**
     * Renders dots.
     */
    var renderDots = function() {
        var toolsWidth = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
        ctx.strokeStyle = $('#color-dummy').css('color');
        ctx.clearRect(-w.origin.x, -w.origin.y, workspace.width / w.scale, workspace.height / w.scale);
        ctx.fillRect(-5, -5, 10, 10);

        for (var i = Math.floor(-w.origin.x / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; i < Math.ceil(((workspace.width) / w.scale + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS; i += SPACE_BETWEEN_DOTS) {
            for (var j = Math.floor(-w.origin.y / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; j < Math.ceil(((workspace.width) / w.scale + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS; j += SPACE_BETWEEN_DOTS) {
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
