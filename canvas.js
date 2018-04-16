
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const DEFAULT_CENTRE_POINT = new Point(0, 0);
const DEFAULT_X_SCALE = 1;
const DEFAULT_Y_SCALE = 1;
const PIXELS_BETWEEN_INTERVALS = 30;

const GREY = "#A0A0A0"
const BLACK = "#000000";
const RED = "#FF0000";

var canvas;
var ctx2d;
var workspace;

// coordinates inside the canvas that is the centre of the canvas
var centrePosOfCanvas;
// coordinates of the point at the centre of the canvas
var centrePoint = DEFAULT_CENTRE_POINT;
var xScale = DEFAULT_X_SCALE;
var yScale = DEFAULT_Y_SCALE;

function setUpCanvas() {
    workspace = $("#workspace")[0];
    canvas = $("#canvas")[0];
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width;
    centrePosOfCanvas = new Point(canvas.width/2, canvas.height/2);
    ctx2d = canvas.getContext("2d");
    
    ctx2d.fillStyle = GREY;
    ctx2d.fillRect(0,0,canvas.width,canvas.height);
    
    ctx2d.fillStyle = BLACK;
    ctx2d.font="50px Arial";
    ctx2d.fillText("This is the canvas.", 200, 200);

    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width-5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height-5, 5, 5);
    ctx2d.fillRect(canvas.width-5, canvas.height-5, 5, 5);

    ctx2d.beginPath();
    ctx2d.arc(centrePosOfCanvas.x, centrePosOfCanvas.y, 10, 0, 2*Math.PI);
    ctx2d.fill();
}