/* global Util */

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class GraphProperties {
    constructor(topPoint, bottomPoint, leftPoint, rightPoint, width, height) {
        this.topPoint = topPoint;
        this.bottomPoint = bottomPoint;
        this.leftPoint = leftPoint;
        this.rightPoint = rightPoint;
        this.width = width;
        this.height = height;
    }

    reset() {
        this.topPoint = this.height / 2 / OPTIMAL_PIXELS_BETWEEN_INTERVALS;
        this.bottomPoint = -this.height / 2 / OPTIMAL_PIXELS_BETWEEN_INTERVALS;
        this.leftPoint = -this.width / 2 / OPTIMAL_PIXELS_BETWEEN_INTERVALS;
        this.rightPoint = this.width / 2 / OPTIMAL_PIXELS_BETWEEN_INTERVALS;
    }

    calculate() {
        this.calculateScale();
        this.calculatePoints();
    }

    calculateScale() {

        this.scaleX = (this.rightPoint - this.leftPoint) / (this.width / OPTIMAL_PIXELS_BETWEEN_INTERVALS);
        this.scaleY = (this.topPoint - this.bottomPoint) / (this.height / OPTIMAL_PIXELS_BETWEEN_INTERVALS);

        var minIntervalX = 0;
        var minIntervalXDifference = Number.MAX_VALUE;
        var mantissaX = Util.getMantissa(this.scaleX);

        var minIntervalY = 0;
        var minIntervalYDifference = Number.MAX_VALUE;
        var mantissaY = Util.getMantissa(this.scaleY);

        for (var interval in OPTIMAL_INTERVALS) {
            if (Math.abs(interval - mantissaX) <= minIntervalXDifference) {
                minIntervalXDifference = Math.abs(interval - mantissaX);
                minIntervalX = interval;
            }
            if (Math.abs(interval - mantissaY) <= minIntervalYDifference) {
                minIntervalYDifference = Math.abs(interval - mantissaY);
                minIntervalY = interval;
            }
        }

        this.optimalScaleX = minIntervalX * Math.pow(10, Math.floor(Math.log10(this.scaleX)));
        this.intervalScaleX = Number.parseInt(minIntervalX);
        this.minorBetweenMajorX = OPTIMAL_INTERVALS[minIntervalX];

        this.optimalScaleY = minIntervalY * Math.pow(10, Math.floor(Math.log10(this.scaleY)));
        this.intervalScaleY = Number.parseInt(minIntervalY);
        this.minorBetweenMajorY = OPTIMAL_INTERVALS[minIntervalY];

        this.pixelIntervalX = OPTIMAL_PIXELS_BETWEEN_INTERVALS * (this.optimalScaleX / this.scaleX);
        this.pixelIntervalY = OPTIMAL_PIXELS_BETWEEN_INTERVALS * (this.optimalScaleY / this.scaleY);
    }

    calculatePoints() {
        this.originPos = new Point(-this.leftPoint * (this.pixelIntervalY / this.optimalScaleY), this.topPoint * (this.pixelIntervalX / this.optimalScaleX));
        this.centrePoint = new Point((this.topPoint + this.bottomPoint) / 2, (this.leftPoint + this.rightPoint) / 2);
    }

    resize(xTimes, yTimes) {
        this.calculatePoints();

        this.topPoint = this.centrePoint.y + (this.topPoint - this.centrePoint.y) * yTimes;
        this.bottomPoint = this.centrePoint.y - (this.centrePoint.y - this.bottomPoint) * yTimes;
        this.leftPoint = this.centrePoint.x - (this.centrePoint.x - this.leftPoint) * xTimes;
        this.rightPoint = this.centrePoint.x + (this.rightPoint - this.centrePoint.x) * xTimes;

        this.calculate();
        drawGraph();

        canvas.style.cursor = "default";
    }
}

const DEFAULT_X_SCALE = 1;
const DEFAULT_Y_SCALE = 1;

// line widths
const MINOR_GRIDLINE_WIDTH = 0.2;
const MAJOR_GRIDLINE_WIDTH = 0.7;
const AXIS_GRIDLINE_WIDTH = 1.5;

// multipler for each scroll
const SCROLL_MULTIPLIER = 2;

// optimal number of pixels between each minor gridline
const OPTIMAL_PIXELS_BETWEEN_INTERVALS = 30;

// list of optimal intervals {multiple: number of minor gridlines between each major gridline}
const OPTIMAL_INTERVALS = { 1: 5, 2: 4, 5: 5 };

// period of time for resize animation in seconds
const RESIZE_ANIMATION_LENGTH = 0.3;
const MILLISECONDS_IN_SECOND = 1000;

// colours
const GREY = "#F0F0F0";
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

// boundaries of the graph
var graphProperties;

// variables to keep track of the resize animation
var resizeAnimationStart;
var startResizeScale;
var targetResizeScale;

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
 * Starts the graph resize animation.
 *
 * @param {number} xTimes
 * @param {number} yTimes
 */
function resizeGraph(xTimes, yTimes) {


    // scale before resizing
    startResizeScale = new Point();
    startResizeScale.x = graphProperties.xScale;
    startResizeScale.y = graphProperties.yScale;

    // scale after resizing
    targetResizeScale = new Point();
    targetResizeScale.x = graphProperties.xScale * xTimes;
    targetResizeScale.y = graphProperties.yScale * yTimes;

    // time that resizing animation started 
    resizeAnimationStart = null;

    // set cursor image
    if (xTimes * yTimes < 1) {
        canvas.style.cursor = "zoom-in";
    } else {
        canvas.style.cursor = "zoom-out";
    }

    // start resize animation
    //window.requestAnimationFrame(animateResize);
}

/**
 * Called during each frame of the resize animation.
 * 
 * @param {DOMHighResTimeStamp} timestamp 
 */
function animateResize(timestamp) {

    if (resizeAnimationStart == null) {
        resizeAnimationStart = timestamp;
    }

    var elapsedTime = timestamp - resizeAnimationStart;
    var elapsedPercentage = Math.min(elapsedTime / (RESIZE_ANIMATION_LENGTH * MILLISECONDS_IN_SECOND), 1);

    xScale = startResizeScale.x + (targetResizeScale.x - startResizeScale.x) * elapsedPercentage;
    yScale = startResizeScale.y + (targetResizeScale.y - startResizeScale.y) * elapsedPercentage;
    drawGraph();

    if (xScale == targetResizeScale.x && yScale == targetResizeScale.y) {
        canvas.style.cursor = "default";
    } else {
        window.requestAnimationFrame(animateResize);
    }
}

/**
 * Pans the graph.
 *
 * @param {number} xMove - distance moved in pixels
 * @param {number} yMove - distance moved in pixels
 */
function panGraph(xMovePix, yMovePix) {

    let xMove = xMovePix / graphProperties.pixelIntervalX;
    let yMove = yMovePix / graphProperties.pixelIntervalY;

    graphProperties.leftPoint += xMove * graphProperties.scaleX;
    graphProperties.rightPoint += xMove * graphProperties.scaleX;
    graphProperties.topPoint += yMove * graphProperties.scaleY;
    graphProperties.bottomPoint += yMove * graphProperties.scaleY;

    drawGraph();
}

/**
 * Sets up variables for the graph.
 */
function setUpGraph() {

    workspace = $("#workspace")[0];
    canvas = $("#canvas")[0];

    // Get dimensions of canvas
    canvas.height = workspace.getBoundingClientRect().height;
    canvas.width = workspace.getBoundingClientRect().width - document.getElementById("tools").offsetWidth;

    // Get context of canvas
    ctx2d = canvas.getContext("2d");

    // set up graph properties
    graphProperties = new GraphProperties(canvas.height / OPTIMAL_PIXELS_BETWEEN_INTERVALS, -canvas.height / OPTIMAL_PIXELS_BETWEEN_INTERVALS, -canvas.width / OPTIMAL_PIXELS_BETWEEN_INTERVALS, canvas.width / OPTIMAL_PIXELS_BETWEEN_INTERVALS, canvas.width, canvas.height);
    graphProperties.reset();
    graphProperties.calculate();

    // handle zooming
    canvas.addEventListener("wheel", function (wheel) {
        if (wheel.deltaY > 0) {
            canvas.style.cursor = "zoom-out";
            graphProperties.resize(SCROLL_MULTIPLIER, SCROLL_MULTIPLIER);
        } else {
            canvas.style.cursor = "zoom-in";
            graphProperties.resize(1 / SCROLL_MULTIPLIER, 1 / SCROLL_MULTIPLIER);
        }
    });

    // handle panning
    canvas.addEventListener("mousedown", function (mousedown) {
        canvas.style.cursor = "move";
        var lastX = mousedown.x;
        var lastY = mousedown.y;
        var mousemoveListener = function (mousemove) {
            panGraph(lastX - mousemove.x, mousemove.y - lastY);
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

    drawGraph();
}

/**
 * Clears the graph and redraws everything.
 */
function drawGraph() {

    // Clear tne canvas
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);

    graphProperties.calculatePoints();

    // Fill background of canvas
    ctx2d.fillStyle = BACKGROUND_COLOUR;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);

    // Rectangles at the four corner of the canvas
    ctx2d.fillStyle = RED;
    ctx2d.fillRect(0, 0, 5, 5);
    ctx2d.fillRect(canvas.width - 5, 0, 5, 5);
    ctx2d.fillRect(0, canvas.height - 5, 5, 5);
    ctx2d.fillRect(canvas.width - 5, canvas.height - 5, 5, 5);

    // Set up gridlines
    ctx2d.strokeStyle = BLACK;
    ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;

    // draw vertical lines

    let leftMostLinePos = graphProperties.originPos.x + Util.awayFromZero(graphProperties.leftPoint / graphProperties.optimalScaleX) * graphProperties.pixelIntervalX;
    let rightMostLinePos = graphProperties.originPos.x + Util.awayFromZero(graphProperties.rightPoint / graphProperties.optimalScaleX) * graphProperties.pixelIntervalX;

    let majorIntervalXCount = (Math.floor((graphProperties.originPos.x - leftMostLinePos) / graphProperties.pixelIntervalX) % graphProperties.minorBetweenMajorX + graphProperties.minorBetweenMajorX) % graphProperties.minorBetweenMajorX;

    for (let x = leftMostLinePos; x < rightMostLinePos; x += graphProperties.pixelIntervalX) {
        var lineX = Math.round(x) - 0.5;
        if (majorIntervalXCount == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
            majorIntervalXCount = graphProperties.minorBetweenMajorX;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        majorIntervalXCount--;
        ctx2d.beginPath();
        ctx2d.moveTo(lineX, 0);
        ctx2d.lineTo(lineX, canvas.height);
        ctx2d.stroke();
    }

    // draw horizontal lines

    let topMostLinePos = graphProperties.originPos.y - Math.ceil(graphProperties.topPoint / graphProperties.optimalScaleY) * graphProperties.pixelIntervalY;
    let bottomMostLinePos = graphProperties.originPos.y - Math.ceil(graphProperties.bottomPoint / graphProperties.optimalScaleY) * graphProperties.pixelIntervalY;

    let majorIntervalYCount = (Math.floor((graphProperties.originPos.y - topMostLinePos) / graphProperties.pixelIntervalY) % graphProperties.minorBetweenMajorY + graphProperties.minorBetweenMajorY) % graphProperties.minorBetweenMajorY;

    for (let y = topMostLinePos; y < bottomMostLinePos; y += graphProperties.pixelIntervalY) {
        var lineY = Math.round(y) - 0.5;
        if (majorIntervalYCount == 0) {
            ctx2d.lineWidth = MAJOR_GRIDLINE_WIDTH;
            majorIntervalYCount = graphProperties.minorBetweenMajorX;
        } else {
            ctx2d.lineWidth = MINOR_GRIDLINE_WIDTH;
        }
        majorIntervalYCount--;
        ctx2d.beginPath();
        ctx2d.moveTo(0, lineY);
        ctx2d.lineTo(canvas.width, lineY);
        ctx2d.stroke();
    }

    // draw centre dot
    ctx2d.fillStyle = RED;
    ctx2d.beginPath();
    ctx2d.arc(graphProperties.originPos.x, graphProperties.originPos.y, 3, 0, 2 * Math.PI);
    ctx2d.fill();

    // vertical axis line
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(Math.round(graphProperties.originPos.x) - 0.5, 0);
    ctx2d.lineTo(Math.round(graphProperties.originPos.x) - 0.5, canvas.width);
    ctx2d.stroke();

    //horizontal axis line
    ctx2d.lineWidth = AXIS_GRIDLINE_WIDTH;
    ctx2d.beginPath();
    ctx2d.moveTo(0, Math.round(graphProperties.originPos.y) - 0.5);
    ctx2d.lineTo(canvas.width, Math.round(graphProperties.originPos.y) - 0.5);
    ctx2d.stroke();

    // draw horizontal scale numbers
    let leftMostMajorLine = Math.floor((Math.floor(graphProperties.leftPoint / graphProperties.optimalScaleX) * graphProperties.optimalScaleX) / (graphProperties.minorBetweenMajorX * graphProperties.optimalScaleX)) * (graphProperties.minorBetweenMajorX * graphProperties.optimalScaleX);

    for (let x = leftMostMajorLine; x < graphProperties.rightPoint; x += graphProperties.minorBetweenMajorX * graphProperties.optimalScaleX) {
        if (Math.abs(x * (graphProperties.pixelIntervalX / graphProperties.optimalScaleX)) > 1) {
            drawScaleNumbersWithBackground(getScaleNumber(x), graphProperties.originPos.x + x * (graphProperties.pixelIntervalX / graphProperties.optimalScaleX), graphProperties.originPos.y + 5, "horizontal", AXIS_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
        }
    }

    // draw vertical scale gridlines
    let topMostMajorLine = Math.floor((Math.floor(graphProperties.topPoint / graphProperties.optimalScaleY) * graphProperties.optimalScaleY) / (graphProperties.minorBetweenMajorY * graphProperties.optimalScaleY)) * (graphProperties.minorBetweenMajorY * graphProperties.optimalScaleY);
    for (let y = topMostMajorLine; y > graphProperties.bottomPoint; y -= graphProperties.minorBetweenMajorY * graphProperties.optimalScaleY) {
        if (Math.abs(y * (graphProperties.pixelIntervalY / graphProperties.optimalScaleY)) > 1) {
            drawScaleNumbersWithBackground(getScaleNumber(y), graphProperties.originPos.x - 5, graphProperties.originPos.y - y * (graphProperties.pixelIntervalY / graphProperties.optimalScaleY), "vertical", AXIS_NUMBERS_FONT, BACKGROUND_COLOUR, BLACK);
        }
    }
}
