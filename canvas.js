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
const MINOR_GRIDLINE_WIDTH = 0.3;
const MAJOR_GRIDLINE_WIDTH = 0.5;
const MAJOR_GRIDLINE_INTERVAL = 5;
const AXIS_GRIDLINE_WIDTH = 0.9;

// colours
const GREY = "#F0F0F0"
const BLACK = "#000000";
const RED = "#FF0000";
const WHITE = "#FFFFFF"
const BACKGROUND_COLOUR = GREY;

// font
const MAJOR_GRIDLINE_NUMBERS_FONT = "12px Arial";

var canvas;
var ctx2d;
var workspace;

// coordinates inside the canvas that is the centre of the canvas
var centrePosOfCanvas;
// coordinates of the point at the centre of the canvas
var centrePoint = DEFAULT_CENTRE_POINT;
var xScale = DEFAULT_X_SCALE;
var yScale = DEFAULT_Y_SCALE;

function drawNumberLabelsWithBackground(text, x, y, axis, font, background, textColour) {
    ctx2d.font = font;
    ctx2d.fillStyle = background;
    if (axis == "horizontal") {
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "top";
        ctx2d.fillRect(x-(ctx2d.measureText(text).width/2), y, ctx2d.measureText(text).width+2, parseInt(ctx2d.font)+2);
    } else {
        ctx2d.textAlign = "right";
        ctx2d.textBaseline = "middle";
        ctx2d.fillRect(x-ctx2d.measureText(text).width-1, y-(parseInt(ctx2d.font)/2), ctx2d.measureText(text).width+2, parseInt(ctx2d.font)+2);
    }
    ctx2d.fillStyle = textColour;
    ctx2d.fillText(text, x, y);
}

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
    ctx2d.fillStyle = BACKGROUND_COLOUR;
    ctx2d.fillRect(0,0,canvas.width,canvas.height);

    // rectangles at the four corner of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width-5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height-5, 5, 5);
    ctx2d.fillRect(canvas.width-5, canvas.height-5, 5, 5);

    // set up gridlines
    ctx2d.strokeStyle = BLACK;

    // vertical gridlines right of centre
    for (var x=centrePosOfCanvas.x; x<canvas.width; x+=PIXELS_BETWEEN_INTERVALS) {
        if (((x - centrePosOfCanvas.x) / PIXELS_BETWEEN_INTERVALS) % MAJOR_GRIDLINE_INTERVAL == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, canvas.height);
        ctx2d.stroke();
    }

    // vertical gridlines left of centre
    for (var x=centrePosOfCanvas.x; x>0; x-=PIXELS_BETWEEN_INTERVALS) {
        if (((x - centrePosOfCanvas.x) / PIXELS_BETWEEN_INTERVALS) % MAJOR_GRIDLINE_INTERVAL == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, canvas.height);
        ctx2d.stroke();
    }

    // horizontal gridlines below centre
    for (var y=centrePosOfCanvas.y; y<canvas.height; y+=PIXELS_BETWEEN_INTERVALS) {
        if (((y - centrePosOfCanvas.y) / PIXELS_BETWEEN_INTERVALS) % MAJOR_GRIDLINE_INTERVAL == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(canvas.width, y);
        ctx2d.stroke();
    }

    // horizontal gridlines above centre
    for (var y=centrePosOfCanvas.y; y>0; y-=PIXELS_BETWEEN_INTERVALS) {
        if (((y - centrePosOfCanvas.y) / PIXELS_BETWEEN_INTERVALS) % MAJOR_GRIDLINE_INTERVAL == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(canvas.width, y);
        ctx2d.stroke();
    }

    // darker vertical axis lines
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(centrePosOfCanvas.x, 0);
    ctx2d.lineTo(centrePosOfCanvas.x, canvas.width);
    ctx2d.stroke();

    // darker horizontal axis lines
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(0, centrePosOfCanvas.y);
    ctx2d.lineTo(canvas.width, centrePosOfCanvas.y);
    ctx2d.stroke();

    // number labels for horizontal
    ctx2d.font = MAJOR_GRIDLINE_NUMBERS_FONT;

    // horizontal right of centre
    for (var x=centrePosOfCanvas.x + PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL; x<canvas.width; x+=PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL) {
        drawNumberLabelsWithBackground(((x - centrePosOfCanvas.x) / PIXELS_BETWEEN_INTERVALS) * xScale, x, centrePosOfCanvas.y+5, "horizontal", MAJOR_GRIDLINE_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
    }

    // horizontal left of centre
    for (var x=centrePosOfCanvas.x - PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL; x>0; x-=PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL) {
        drawNumberLabelsWithBackground(((x - centrePosOfCanvas.x) / PIXELS_BETWEEN_INTERVALS) * xScale, x, centrePosOfCanvas.y+5, "horizontal", MAJOR_GRIDLINE_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
    }

    // vertical below centre
    ctx2d.textAlign = "right";
    ctx2d.textBaseline = "middle";
    for (var y=centrePosOfCanvas.y + PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL; y<canvas.height; y+=PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL) {
        drawNumberLabelsWithBackground(((centrePosOfCanvas.y - y) / PIXELS_BETWEEN_INTERVALS) * yScale, centrePosOfCanvas.x-5, y, "vertical", MAJOR_GRIDLINE_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
    }

    // vertical above centre
    ctx2d.textAlign = "right";
    ctx2d.textBaseline = "middle";
    for (var y=centrePosOfCanvas.y - PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL; y>0; y-=PIXELS_BETWEEN_INTERVALS*MAJOR_GRIDLINE_INTERVAL) {
        drawNumberLabelsWithBackground(((centrePosOfCanvas.y - y) / PIXELS_BETWEEN_INTERVALS) * yScale, centrePosOfCanvas.x-5, y, "vertical", MAJOR_GRIDLINE_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
    }

    // draw circle in the centre of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.beginPath();
    ctx2d.arc(centrePosOfCanvas.x, centrePosOfCanvas.y, 2, 0, 2*Math.PI);
    ctx2d.fill();

}
