
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// constants
const DEFAULT_CENTRE_POINT = new Point(0, 0);
const DEFAULT_X_SCALE = 1;
const DEFAULT_Y_SCALE = 1;
const PIXELS_BETWEEN_INTERVALS = 30;
const GRIDLINE_WIDTH = 0.3;

// colours
const GREY = "#C0C0C0"
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

    // get dimensions of canvas
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width;
    centrePosOfCanvas = new Point(canvas.width/2, canvas.height/2);

    // get context of canvas
    ctx2d = canvas.getContext("2d");
    
    drawCanvas();
}

function drawCanvas() {

    // fill background of canvas
    ctx2d.fillStyle = GREY;
    ctx2d.fillRect(0,0,canvas.width,canvas.height);

    // rectangles at the four corner of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width-5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height-5, 5, 5);
    ctx2d.fillRect(canvas.width-5, canvas.height-5, 5, 5);

    // set up gridlines
    ctx2d.strokeStyle = BLACK;
    ctx2d.lineWidth = GRIDLINE_WIDTH;

    // vertical gridlines right of centre
    for (var x=centrePosOfCanvas.x; x<canvas.width; x+=PIXELS_BETWEEN_INTERVALS) {
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, canvas.height);
        ctx2d.stroke();
    }

    // vertical gridlines left of centre
    for (var x=centrePosOfCanvas.x; x>0; x-=PIXELS_BETWEEN_INTERVALS) {
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, canvas.height);
        ctx2d.stroke();
    }

    // horizontal gridlines below centre
    for (var y=centrePosOfCanvas.y; y<canvas.height; y+=PIXELS_BETWEEN_INTERVALS) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(canvas.width, y);
        ctx2d.stroke();
    }

    // horizontal gridlines above centre
    for (var y=centrePosOfCanvas.y; y>0; y-=PIXELS_BETWEEN_INTERVALS) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(canvas.width, y);
        ctx2d.stroke();
    }

    // draw circle in the centre of the canvas
    ctx2d.beginPath();
    ctx2d.arc(centrePosOfCanvas.x, centrePosOfCanvas.y, 2, 0, 2*Math.PI);
    ctx2d.fill();

}