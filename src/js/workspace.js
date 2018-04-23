const SPACE_BETWEEN_DOTS = 50;
var workspace   = null;
var totalChange = [0, 0];
var origin      = null;
var scale       = 1;

function createWorkspace() {
    workspace = document.getElementById('workspace');
    var ctx       = workspace.getContext('2d');

    workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
    workspace.height = document.getElementById('content').offsetHeight;

    origin = new Point(workspace.width / 2, workspace.height / 2);

    var panLoop = null;
    workspace.addEventListener("mousedown", function() {
        TweenMax.killAll();
        TweenMax.to("#color-dummy", 0.3, {color: '#9d9d9d'});
        panLoop = setInterval(function() {
            origin.x += deltaX;
            origin.y += deltaY;
            renderDots(ctx);
        }, 10);
    });

    window.addEventListener("mouseup", function() {
        if (panLoop != null) {
            TweenMax.killAll();
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
        scale *= e.deltaY > 0 ? 1 / 1.2 : 1.2;
        renderDots(ctx);
    });

    renderDots(ctx);
}

function renderDots(ctx) {
    ctx.strokeStyle = $('#color-dummy').css('color');
    ctx.clearRect(0, 0, workspace.width, workspace.height);
    var spaceBetweenDots = SPACE_BETWEEN_DOTS / scale;
    console.log(spaceBetweenDots);

    for (var i = origin.x % spaceBetweenDots - spaceBetweenDots + 0.5; i < origin.x % spaceBetweenDots + spaceBetweenDots + workspace.width + 0.5; i += spaceBetweenDots) {
        for (var j = origin.y % spaceBetweenDots - spaceBetweenDots + 0.5; j < origin.y % spaceBetweenDots + spaceBetweenDots + workspace.width + 0.5; j += spaceBetweenDots) {
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
