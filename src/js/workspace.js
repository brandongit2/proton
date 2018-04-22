const SPACE_BETWEEN_DOTS = 50;
var workspace   = null;
var dots        = [];
var totalChange = [0, 0];

function createWorkspace() {
    workspace = document.getElementById('workspace');
    var ctx       = workspace.getContext('2d');

    workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
    workspace.height = document.getElementById('content').offsetHeight;

    var origin = new Point(workspace.width / 2, workspace.height / 2);

    // Create small dots over the workspace
    for (var i = 0; i < workspace.height; i += SPACE_BETWEEN_DOTS) {
        for (var j = 0; j < workspace.width; j += SPACE_BETWEEN_DOTS) {
            dots.push(new Point(Math.round(j), Math.round(i)));
        }
    }

    var panLoop = null;
    workspace.addEventListener("mousedown", function() {
        panLoop = setInterval(function() {
            origin.x += deltaX;
            origin.y += deltaY;
            ctx.translate(deltaX, deltaY);
            renderDots(ctx);
        }, 10);
    });

    window.addEventListener("mouseup", function() {
        if (panLoop != null) {
            clearInterval(panLoop);
        }
    });

    renderDots(ctx);
}

function renderDots(ctx) {
    ctx.strokeStyle = '#cfcfcf';
    ctx.clearRect(0, 0, workspace.width, workspace.height);

    for (var dot of dots) {
        ctx.beginPath();
        ctx.moveTo(dot.x - 1.5, dot.y + 0.5);
        ctx.lineTo(dot.x + 2.5, dot.y + 0.5);
        ctx.moveTo(dot.x + 0.5, dot.y - 1.5);
        ctx.lineTo(dot.x + 0.5, dot.y + 2.5);
        ctx.stroke();
    }
}

function pan(ctx) {
    for (var dot of dots) {
        dot.x += deltaX;
        dot.y += deltaY;
    }
}
