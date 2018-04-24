const SPACE_BETWEEN_DOTS = 50;
var workspace   = null;
var totalChange = [0, 0];
var origin      = {x: 0, y: 0};
var screenPos   = [0, 0, 0, 0]; // [top, right, bottom, left]
var scale       = 1;
var targetScale = 1;

function createWorkspace() {
    workspace = document.getElementById('workspace');
    var ctx   = workspace.getContext('2d');

    workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
    workspace.height = document.getElementById('content').offsetHeight;

    origin.x  = workspace.width / 2;
    origin.y  = workspace.height / 2;
    screenPos = [-origin.y, workspace.width - origin.x, workspace.height - origin.y, -origin.x];
    ctx.translate(origin.x, origin.y);

    var panLoop = null;
    var colorAnimation = null;
    workspace.addEventListener("mousedown", function() {
        if (colorAnimation != null) {
            colorAnimation.kill();
        }
        TweenMax.to("#color-dummy", 0.3, {color: '#9d9d9d'});
        panLoop = setInterval(function() {
            origin.x += deltaX;
            origin.y += deltaY;
            ctx.translate(deltaX, deltaY);
            screenPos[1] -= deltaX;
            screenPos[3] -= deltaX;
            screenPos[0] -= deltaY;
            screenPos[2] -= deltaY;
            renderDots(ctx);
        }, 10);
    });

    window.addEventListener("mouseup", function() {
        if (panLoop != null) {
            if (colorAnimation != null) {
                colorAnimation.kill();
            }
            TweenMax.to("#color-dummy", 0.3, {color: '#cfcfcf'});
            var animateBack = setInterval(function() {
                renderDots(ctx);
            }, 10);
            setTimeout(function() {
                clearInterval(animateBack);
            }, 300);
            clearInterval(panLoop);
        }
    });

    workspace.addEventListener("wheel", function(e) {
        targetScale *= e.deltaY > 0 ? 1 / 1.2 : 1.2;
        if (zoomAnimation != null) {
            zoomAnimation.kill();
        }
        var zoomAnimation = TweenMax.to(window, 0.2, {scale: targetScale});

        var prevScale = scale;
        var animateZoom = setInterval(function() {
            ctx.scale(scale / prevScale, scale / prevScale);
            prevScale = scale;
            renderDots(ctx);
        }, 10);
        setTimeout(function() {
            clearInterval(animateZoom);
        }, 200);
        renderDots(ctx);
    });

    renderDots(ctx);
}

function renderDots(ctx) {
    ctx.strokeStyle = $('#color-dummy').css('color');
    ctx.clearRect(screenPos[3], screenPos[0], screenPos[1] - screenPos[3], screenPos[2] - screenPos[0]);
    ctx.fillRect(0, 0, 10, 10);

    for (var i = Math.floor(-origin.x / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS + 0.5; i < Math.ceil((-origin.x + workspace.width + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS + 0.5; i += SPACE_BETWEEN_DOTS) {
        for (var j = Math.floor(-origin.y / SPACE_BETWEEN_DOTS - 1) * SPACE_BETWEEN_DOTS + 0.5; j < Math.ceil((-origin.y + workspace.width + 1) / SPACE_BETWEEN_DOTS) * SPACE_BETWEEN_DOTS + 0.5; j += SPACE_BETWEEN_DOTS) {
            ctx.beginPath();
            ctx.moveTo(i - 2, j);
            ctx.lineTo(i + 2, j);
            ctx.moveTo(i, j - 2);
            ctx.lineTo(i, j + 2);
            ctx.stroke();
        }
    }
}

function pan(ctx) {
}
