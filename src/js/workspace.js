const SPACE_BETWEEN_DOTS = 50;
var workspace   = null;
var totalChange = [0, 0];
var origin      = null;

function createWorkspace() {
    workspace = document.getElementById('workspace');
    var ctx       = workspace.getContext('2d');

    workspace.width  = document.getElementById('content').offsetWidth - document.getElementById('tools').offsetWidth;
    workspace.height = document.getElementById('content').offsetHeight;

    origin = new Point(workspace.width / 2, workspace.height / 2);

    var panLoop = null;
    workspace.addEventListener("mousedown", function() {
        panLoop = setInterval(function() {
            origin.x += deltaX;
            origin.y += deltaY;
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

    for (var i = origin.x % SPACE_BETWEEN_DOTS + 0.5; i < origin.x % SPACE_BETWEEN_DOTS + workspace.width + 0.5; i += SPACE_BETWEEN_DOTS) {
        for (var j = origin.y % SPACE_BETWEEN_DOTS + 0.5; j < origin.y % SPACE_BETWEEN_DOTS + workspace.width + 0.5; j += SPACE_BETWEEN_DOTS) {
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
