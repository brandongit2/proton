class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const DEFAULT_CENTRE_POINT = new Point(5, 5);
const DEFAULT_X_SCALE = 1;
const DEFAULT_Y_SCALE = 1;

// line widths
const MINOR_GRIDLINE_WIDTH = 0.2;
const MAJOR_GRIDLINE_WIDTH = 0.7;
const AXIS_GRIDLINE_WIDTH = 1.5;

// multipler for each scroll
const SCROLL_MULTIPLIER = 1.3;

const OPTIMAL_PIXELS_BETWEEN_INTERVALS = 30;

// list of optimal intervals {multiple: number of minor gridlines between each major gridline}
const OPTIMAL_INTERVALS = { 1: 5, 2: 4, 5: 5 };

// colours
const GREY = "#F0F0F0"
const BLACK = "#000000";
const RED = "#FF0000";
const WHITE = "#FFFFFF";
const GREEN = "#008000";

const BACKGROUND_COLOUR = GREY;

// font
const AXIS_NUMBERS_FONT = "12px Arial";
const AXIS_NUMBERS_MAX_PLACES = 4;
const AXIS_NUMBERS_PERCISION = 3;

var canvas;
var ctx2d;
var workspace;

/*
Any variables ending in "Pos" represent acutal canvas coordiantes.
Any variables ending in "Point" represent graph coordiantes.
*/

// centre of the canvas
var centrePos;
var centrePoint = DEFAULT_CENTRE_POINT;

// scales for horizontal and vertical axises
var xScale = DEFAULT_X_SCALE;
var yScale = DEFAULT_Y_SCALE;

// current number of pixels between intervals
var curPixelInterval;

// current number of minor gridlines between major gridlines
var curGridlineInterval;

/**
 * Returns the formatted value to be displayed on the scale.
 * 
 * @param {number} num - the raw value to be displayed
 */
function getScaleNumber(num) {
    if (Util.isIntegerPosition(num)) {
        if (Math.log10(Math.abs(num)) > AXIS_NUMBERS_MAX_PLACES) {
            return num.toExponential(AXIS_NUMBERS_PERCISION);
        } else {
            return Math.round(num);
        }
    } else {
        if (Math.abs(Math.log10(Math.abs(num))) > AXIS_NUMBERS_MAX_PLACES) {
            return num.toExponential(AXIS_NUMBERS_PERCISION);
        } else {
            console.log(num);
            return parseFloat(num.toPrecision(AXIS_NUMBERS_PERCISION));
        }
    }
}

/**
 * Draws labels on the axis.
 * 
 * @param {string} text - text to be displayed
 * @param {number} x - x position of the label
 * @param {number} y - y position of the label
 * @param {string} axis - axis the label will be positioend on
 * @param {string} font - font of the label
 * @param {string} background - background colour of the label
 * @param {string} textColour - colour of the text
 */
function drawScaleNumbersWithBackground(text, x, y, axis, font, background, textColour) {
    ctx2d.font = font;
    ctx2d.fillStyle = background;
    if (axis == "horizontal") {
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "top";
        ctx2d.fillRect(x - (ctx2d.measureText(text).width / 2), y, ctx2d.measureText(text).width + 2, parseInt(ctx2d.font) + 2);
    } else {
        ctx2d.textAlign = "right";
        ctx2d.textBaseline = "middle";
        ctx2d.fillRect(x - ctx2d.measureText(text).width - 1, y - (parseInt(ctx2d.font) / 2), ctx2d.measureText(text).width + 2, parseInt(ctx2d.font) + 2);
    }
    ctx2d.fillStyle = textColour;
    ctx2d.fillText(text, x, y);
}

/**
 * Returns the optimal scale set for the scale specified. The optimal scale set will be a multiple of the scales specified in {@link OPTIMAL_INTERVALS}.
 * 
 * @param {number} curScale - the current scale
 * @returns {number[]} - [number of pixels for the optimal interval, the optimal interval]
 */
function getOptimalScaleSet(curScale) {

    var minInterval = 0;
    var minIntervalDifference = Number.MAX_VALUE;
    var mantissa = Util.getMantissa(curScale);

    // loop through optimal intervals and select the one that is the closest to the current scale
    for (var interval in OPTIMAL_INTERVALS) {
        if (Math.abs(interval - mantissa) <= minIntervalDifference) {
            minIntervalDifference = Math.abs(interval - mantissa);
            minInterval = interval;
        }
    }

    // convert the closest interval to number of pixels
    var optiminalInterval = minInterval * Math.pow(10, Math.floor(Math.log10(curScale)));

    return [optiminalInterval, minInterval];
}

/**
 * Resizes the graph.
 * 
 * @param {number} xTimes 
 * @param {number} yTimes 
 */
function resizeGraph(xTimes, yTimes) {
    xScale *= xTimes;
    yScale *= yTimes;
    drawGraph();
    canvas.style.cursor = "default";
}

/**
 * Pans the graph.
 * 
 * @param {number} xMove 
 * @param {number} yMove 
 */
function panGraph(xMove, yMove) {
    centrePoint.x += xMove * xScale;
    centrePoint.y += yMove * yScale;
    drawGraph();
}

/**
 * Sets up variables for the graph.
 */
function setupGraph() {

    workspace = $("#workspace")[0];
    canvas = $("#canvas")[0];

    // get dimensions of canvas
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width;
    centrePos = new Point(canvas.width / 2, canvas.height / 2);

    // get context of canvas
    ctx2d = canvas.getContext("2d");

    // handle zooming
    canvas.addEventListener("wheel", function (wheel) {
        if (wheel.deltaY > 0) {
            canvas.style.cursor = "zoom-out";
            resizeGraph(SCROLL_MULTIPLIER, SCROLL_MULTIPLIER);
        } else {
            canvas.style.cursor = "zoom-in";
            resizeGraph(1 / SCROLL_MULTIPLIER, 1 / SCROLL_MULTIPLIER);
        }
    });

    // handle panning
    canvas.addEventListener("mousedown", function (mousedown) {
        canvas.style.cursor = "move";
        var lastX = mousedown.x;
        var lastY = mousedown.y;
        var mousemoveListener = function (mousemove) {
            panGraph((lastX - mousemove.x) * 1 / curPixelInterval.x, (mousemove.y - lastY) * 1 / curPixelInterval.y);
            lastX = mousemove.x;
            lastY = mousemove.y;
        };
        var mouseupListener = function mouseupListener(event) {
            canvas.style.cursor = "default";
            canvas.removeEventListener("mousemove", mousemoveListener);
            canvas.removeEventListener("mouseup", mouseupListener);
        };
        canvas.addEventListener("mousemove", mousemoveListener);
        canvas.addEventListener("mouseup", mouseupListener);
    });

    // handle key presses
    window.addEventListener("keypress", function (keypress) {
        switch (keypress.key) {
            case 'c':
                // center on (0, 0)
                centrePoint.x = 0;
                centrePoint.y = 0;
                drawGraph();
                break;
        }
    })

    drawGraph();
}

/**
 * Clears the graph and redraws everything.
 */
function drawGraph() {

    // get optimal scales and the number of pixels in between for the optimal scale
    var optimalXScaleSet = getOptimalScaleSet(xScale);
    var optimalXScale = optimalXScaleSet[0];
    var optimalXInterval = optimalXScaleSet[1];
    var optimalYScaleSet = getOptimalScaleSet(yScale);
    var optimalYScale = optimalYScaleSet[0];
    var optimalYInterval = optimalYScaleSet[1];

    // sets the current scale interval in terms of pixels
    curPixelInterval = new Point();
    curPixelInterval.x = OPTIMAL_PIXELS_BETWEEN_INTERVALS * (optimalXScale / xScale);
    curPixelInterval.y = OPTIMAL_PIXELS_BETWEEN_INTERVALS * (optimalYScale / yScale);

    // sets the current number of minor gridlines between major gridlines
    curGridlineInterval = new Point();
    curGridlineInterval.x = OPTIMAL_INTERVALS[optimalXInterval];
    curGridlineInterval.y = OPTIMAL_INTERVALS[optimalYInterval];

    // sets up the point on a gridline that will be the closest to the centre of the graph 
    var wholeCentrePoint = new Point();
    wholeCentrePoint.x = (Math.floor(centrePoint.x / optimalXScale) * optimalXScale);
    wholeCentrePoint.y = (Math.floor(centrePoint.y / optimalYScale) * optimalYScale);
    var wholeCentrePos = new Point();
    wholeCentrePos.x = centrePos.x + ((wholeCentrePoint.x - centrePoint.x) / xScale) * curPixelInterval.x;
    wholeCentrePos.y = centrePos.y - ((wholeCentrePoint.y - centrePoint.y) / yScale) * curPixelInterval.y;

    // sets up the position of the origin of the graph
    var originPos = new Point();
    originPos.x = wholeCentrePos.x - (wholeCentrePoint.x / xScale) * curPixelInterval.x;
    originPos.y = wholeCentrePos.y + (wholeCentrePoint.y / yScale) * curPixelInterval.y;

    // fill background of canvas
    ctx2d.fillStyle = BACKGROUND_COLOUR;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);

    // rectangles at the four corner of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width - 5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height - 5, 5, 5);
    ctx2d.fillRect(canvas.width - 5, canvas.height - 5, 5, 5);

    // set up gridlines
    ctx2d.strokeStyle = BLACK;
    ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;

    // draw gridlines on horizontal axis
    var majorIntervalCount = Math.abs(Math.round(Math.ceil((0 - originPos.x) / curPixelInterval.x))) % curGridlineInterval.x;

    for (var x = originPos.x + (Math.ceil((0 - originPos.x) / curPixelInterval.x) * curPixelInterval.x); x < canvas.width; x += curPixelInterval.x) {
        var roundedX = Math.round(x);
        if (majorIntervalCount == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
            majorIntervalCount = curGridlineInterval.x;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        majorIntervalCount--;
        ctx2d.beginPath();
        ctx2d.moveTo(roundedX, 0);
        ctx2d.lineTo(roundedX, canvas.height);
        ctx2d.stroke();
    }

    // draw gridlines on vertical axis
    var majorIntervalCount = Math.abs(Math.round(Math.ceil((0 - originPos.y) / curPixelInterval.y))) % curGridlineInterval.y;

    for (var y = originPos.y + (Math.ceil((0 - originPos.y) / curPixelInterval.y) * curPixelInterval.y); y < canvas.height; y += curPixelInterval.y) {
        var roundedY = Math.round(y);
        if (majorIntervalCount == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
            majorIntervalCount = curGridlineInterval.y;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        majorIntervalCount--;
        ctx2d.beginPath();
        ctx2d.moveTo(0, roundedY);
        ctx2d.lineTo(canvas.width, roundedY);
        ctx2d.stroke();
    }

    // darker vertical axis lines
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(originPos.x, 0);
    ctx2d.lineTo(originPos.x, canvas.width);
    ctx2d.stroke();

    // darker horizontal axis lines
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(0, originPos.y);
    ctx2d.lineTo(canvas.width, originPos.y);
    ctx2d.stroke();

    // draw numbers on horizontal axis          
    for (var x = originPos.x + Math.floor((0 - originPos.x) / curPixelInterval.x / curGridlineInterval.x) * curPixelInterval.x * curGridlineInterval.x; x < canvas.width; x += curGridlineInterval.x * curPixelInterval.x) {
        if (!Util.isSamePosition(x, originPos.x)) {
            drawScaleNumbersWithBackground(getScaleNumber((x - originPos.x) / curPixelInterval.x * optimalXScale), x, originPos.y + 5, "horizontal", AXIS_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
        }
    }

    // draw numbers on vertical axis
    for (var y = originPos.y + Math.floor((0 - originPos.y) / curPixelInterval.y / curGridlineInterval.y) * curPixelInterval.y * curGridlineInterval.y; y < canvas.height; y += curGridlineInterval.y * curPixelInterval.y) {
        if (!Util.isSamePosition(y, originPos.y)) {
            drawScaleNumbersWithBackground(getScaleNumber((originPos.y - y) / curPixelInterval.y * optimalYScale), originPos.x - 5, y, "vertical", AXIS_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
        }
    }

    // draw circle in the centre of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.beginPath();
    ctx2d.arc(centrePos.x, centrePos.y, 3, 0, 2 * Math.PI);
    ctx2d.fill();

    // draw circle in closest whole point in centre of canvas
    ctx2d.fillStyle = GREEN;
    ctx2d.beginPath();
    ctx2d.arc(wholeCentrePos.x, wholeCentrePos.y, 3, 0, 2 * Math.PI);
    ctx2d.fill();
}