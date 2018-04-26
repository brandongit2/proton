const SPACE_BETWEEN_DOTS = 50;
var workspace   = null;
var totalChange = [0, 0];
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
            ctx.setTransform(scale, 0, 0, scale, origin.x * scale, origin.y * scale);
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

    var animateZoom = null;
    workspace.addEventListener("wheel", function(e) {
        targetScale *= e.deltaY > 0 ? 1 / 1.2 : 1.2;
        console.log("SCROLL");

        var prevScale = scale;

        clearInterval(animateZoom);
        animateZoom = setInterval(function() {
            console.log(prevScale + " " + scale);
            origin.x += (mouseX - toolsWidth) / scale - (mouseX - toolsWidth) / prevScale;
            origin.y += mouseY / scale - mouseY / prevScale;
            ctx.setTransform(scale, 0, 0, scale, origin.x * scale, origin.y * scale);
            renderDots();
            prevScale = scale;
        }, 10);
        setTimeout(function() {
            clearInterval(animateZoom);
        }, 200);

        if (zoomAnimation != null) {
            zoomAnimation.kill();
        }
        var zoomAnimation = TweenMax.to(window, 0.2, {scale: targetScale});

        renderDots();
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
