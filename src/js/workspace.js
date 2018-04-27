const SPACE_BETWEEN_DOTS = 40;
const MAX_ZOOM           = 10;
const MIN_ZOOM           = 0.9;
const SCALE_FACTOR       = 1.2;
var workspace   = null;
var origin      = {x: 0, y: 0};
var scale       = 1;
var targetScale = 1;
var ctx         = null;

function createWorkspace() {
    workspace = document.getElementById('workspace');
    ctx       = workspace.getContext('2d');

    workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
    workspace.height = document.getElementById('content').offsetHeight;

    origin.x = workspace.width / 2;
    origin.y = workspace.height / 2;
    ctx.translate(origin.x - 0.5, origin.y - 0.5);

    var panLoop        = null;
    var colorAnimation = null;
    var toolsWidth     = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
    workspace.addEventListener("mousedown", function() {
        // Make dots darker when clicked
        if (colorAnimation != null) {
            colorAnimation.kill();
        }
        TweenMax.to("#color-dummy", 0.3, {color: '#9d9d9d'});

        panLoop = setInterval(function() {
            origin.x += deltaX / scale;
            origin.y += deltaY / scale;
            ctx.setTransform(scale, 0, 0, scale, origin.x * scale + 0.5, origin.y * scale + 0.5);
            renderDots();
        }, 10);
    });

    window.addEventListener("mouseup", function() {
        if (panLoop != null) {
            // Make dots lighter again when mouse released
            if (colorAnimation != null) {
                colorAnimation.kill();
            }
            TweenMax.to("#color-dummy", 0.3, {color: '#cfcfcf'});
            var animateBack = setInterval(function() {
                renderDots();
            }, 10);
            setTimeout(function() {
                clearInterval(animateBack);
            }, 300);
            clearInterval(panLoop);
        }
    });

    var scrollEnabled = true;
    var prevScrollDirection = 0;
    workspace.addEventListener("wheel", function(e) {
        if (prevScrollDirection != Math.sign(e.deltaY)) {
            targetScale = scale;
        }
        prevScrollDirection = Math.sign(e.deltaY);
        targetScale *= e.deltaY > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR; // Determine which way to zoom
        // Enforce zoom limits
        if (targetScale > MAX_ZOOM) {
            targetScale = MAX_ZOOM;
        } else if (targetScale < MIN_ZOOM) {
            targetScale = MIN_ZOOM;
        }
        if (scrollEnabled) {
            scrollEnabled = false;
            setTimeout(function() {
                scrollEnabled = true;
            }, 100);

            var prevScale = scale;
            var animateZoom = function() {
                origin.x += (mouseX - toolsWidth) / scale - (mouseX - toolsWidth) / prevScale;
                origin.y += mouseY / scale - mouseY / prevScale;
                ctx.setTransform(scale, 0, 0, scale, origin.x * scale + 0.5, origin.y * scale + 0.5);
                renderDots();
                prevScale = scale;
            };

            if (zoomAnimation != null) {
                zoomAnimation.kill();
            }
            var zoomAnimation = TweenMax.to(window, 0.15, {scale: targetScale, onUpdate: animateZoom});

            renderDots();
        }
    });

    renderDots();
}

function renderDots() {
    var toolsWidth = document.getElementById('tools').offsetWidth; // Used to correct mouse X position for workspace
    ctx.strokeStyle = $('#color-dummy').css('color');
    ctx.clearRect(-origin.x, -origin.y, workspace.width / scale, workspace.height / scale);
    ctx.fillRect(-5, -5, 10, 10);

    for (var i = Math.floor(-origin.x / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; i < Math.ceil(((workspace.width) / scale + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS; i += SPACE_BETWEEN_DOTS) {
        for (var j = Math.floor(-origin.y / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS; j < Math.ceil(((workspace.width) / scale + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS; j += SPACE_BETWEEN_DOTS) {
            ctx.beginPath();
            ctx.moveTo(i - 2, j);
            ctx.lineTo(i + 2, j);
            ctx.moveTo(i, j - 2);
            ctx.lineTo(i, j + 2);
            ctx.stroke();
        }
    }
}
