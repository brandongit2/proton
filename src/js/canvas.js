/* global Util, console, TweenMax, performance */

/*
NOTES:
    - "coordinates" and "point" refer to actual grid coordiantes 
    - "position" refers to the number of pixels from the upper-left corner of the canvas
*/

/**
 * Represents one point on the graph in terms of its X and Y coordinate.
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents the properties of a graph.
 */
class GraphProperties {

    /**
     * Creates a graph properties object.
     * @param {Number} topPoint         The uppermost Y coordinate.
     * @param {Number} bottomPoint      The lowermost Y coordinate.
     * @param {Number} leftPoint        The leftmost X coordinate.
     * @param {Number} rightPoint       The rightmost X coordinate.
     * @param {Object} graph            The graph that these properties apply to.
     */
    constructor(topPoint, bottomPoint, leftPoint, rightPoint, graph) {
        this.topPoint = topPoint;
        this.bottomPoint = bottomPoint;
        this.leftPoint = leftPoint;
        this.rightPoint = rightPoint;
        this.graph = graph;
    }

    /**
     * Resets the graph to show the origin (0, 0) at the centre.
     */
    reset() {
        this.topPoint = this.graph.height / 2 / this.graph.settings.optimalPixelsBetweenIntervals;
        this.bottomPoint = -this.graph.height / 2 / this.graph.settings.optimalPixelsBetweenIntervals;
        this.leftPoint = -this.graph.width / 2 / this.graph.settings.optimalPixelsBetweenIntervals;
        this.rightPoint = this.graph.width / 2 / this.graph.settings.optimalPixelsBetweenIntervals;
    }

    /**
     * Calculates the scale and reference points for the graph.
     */
    calculate() {
        this.calculateScale();
        this.calculatePoints();
    }

    /**
     * Calculates optimal the scale for the graph based on the leftPoint, rightPoint, topPoint, bottomPoint, height, width, and optimalPixelsBetweenIntervals.
     */
    calculateScale() {

        // determines the target scale for the current set of boundaries
        this.scaleX = (this.rightPoint - this.leftPoint) / (this.graph.width / this.graph.settings.optimalPixelsBetweenIntervals);
        this.scaleY = (this.topPoint - this.bottomPoint) / (this.graph.height / this.graph.settings.optimalPixelsBetweenIntervals);

        // determine the best multiple to use for the target scale
        let minIntervalX = 0;
        let minIntervalXDifference = Number.MAX_VALUE;
        let mantissaX = Util.getMantissa(this.scaleX);

        let minIntervalY = 0;
        let minIntervalYDifference = Number.MAX_VALUE;
        let mantissaY = Util.getMantissa(this.scaleY);

        for (var interval in this.graph.settings.optimalIntervals) {
            if (Math.abs(interval - mantissaX) <= minIntervalXDifference) {
                minIntervalXDifference = Math.abs(interval - mantissaX);
                minIntervalX = interval;
            }
            if (Math.abs(interval - mantissaY) <= minIntervalYDifference) {
                minIntervalYDifference = Math.abs(interval - mantissaY);
                minIntervalY = interval;
            }
        }

        // determine that best scale to use with the best multiple determined earlier
        this.optimalScaleX = minIntervalX * Math.pow(10, Math.floor(Math.log10(this.scaleX)));
        this.intervalScaleX = Number.parseInt(minIntervalX);
        this.minorBetweenMajorX = this.graph.settings.optimalIntervals[minIntervalX];

        this.optimalScaleY = minIntervalY * Math.pow(10, Math.floor(Math.log10(this.scaleY)));
        this.intervalScaleY = Number.parseInt(minIntervalY);
        this.minorBetweenMajorY = this.graph.settings.optimalIntervals[minIntervalY];

        // determine the number of pixels between intervals based on the best scale determined earlier
        this.pixelIntervalX = this.graph.settings.optimalPixelsBetweenIntervals * (this.optimalScaleX / this.scaleX);
        this.pixelIntervalY = this.graph.settings.optimalPixelsBetweenIntervals * (this.optimalScaleY / this.scaleY);
    }

    /**
     * Calculates the reference points for the graph.
     */
    calculatePoints() {
        this.originPos = new Point(-this.leftPoint * this.pixelIntervalY / this.optimalScaleY, this.topPoint * this.pixelIntervalX / this.optimalScaleX);
        this.centrePoint = new Point((this.topPoint + this.bottomPoint) / 2, (this.leftPoint + this.rightPoint) / 2);
    }
}

/**
 * Represents a graph and features methods relating to the graph.
 */
class Graph {

    /**
     * @param {HTMLCanvasElement} canvas    The canvas to draw the graph on.
     * @param {Object} settings             The settings for the formatting of the graph.
     * @param {Number} width                The width of the graph.
     * @param {Number} height               The height of the graph.
     */
    constructor(canvas, settings, width, height) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.settings = settings;
        this.setupGraph();
    }

    /**
     * Determines the point that is located at a set of X and Y positions from the top left corner of the canvas. It will convert a pair of positions (in pixels) to grid coordinates.
     * 
     * @param {Number} xCoord       The number of pixels from the left edge.
     * @param {Number} yCoord       The number of pixels from the top edge.
     */
    getPointFromCoordinates(xCoord, yCoord) {
        let curPoint = new Point();
        curPoint.x = this.graphProperties.leftPoint + ((xCoord / this.graphProperties.pixelIntervalX) * this.graphProperties.optimalScaleX);
        curPoint.y = this.graphProperties.topPoint - ((yCoord / this.graphProperties.pixelIntervalY) * this.graphProperties.optimalScaleY);
        return curPoint;
    }

    /**
     * Draws scale numbers onto the graph.
     * 
     * @param {String} text         The text to be displayed on the number label.
     * @param {Number} x            The X coordinate of the number label.
     * @param {Number} y            The Y coordiante of the number label.
     * @param {String} axis         The axis that the label will be displayed on ("horizontal", "vertical").
     * @param {String} alignment    The alignment of the label relative to the point specified ("top", "bottom", "left", "right").
     */
    drawScaleNumbersWithBackground(text, x, y, axis, alignment) {

        // background
        this.ctx2d.fillStyle = this.settings.axisNumbers.background;

        if (axis == "horizontal") {
            // horizontal axis
            this.ctx2d.textAlign = "center";
            this.ctx2d.textBaseline = alignment;
            if (alignment == "top") {
                this.ctx2d.fillRect(x - (this.ctx2d.measureText(text).width / 2), y, this.ctx2d.measureText(text).width + 2, parseInt(this.ctx2d.font) + 2);
            } else if (alignment == "bottom") {
                this.ctx2d.fillRect(x - (this.ctx2d.measureText(text).width / 2), y - parseInt(this.ctx2d.font) - 2, this.ctx2d.measureText(text).width + 2, parseInt(this.ctx2d.font) + 2);
            }
        } else {
            // vertical axis
            this.ctx2d.textAlign = alignment;
            this.ctx2d.textBaseline = "middle";
            if (alignment == "right") {
                this.ctx2d.fillRect(x - this.ctx2d.measureText(text).width - 2, y - (parseInt(this.ctx2d.font) / 2), this.ctx2d.measureText(text).width + 4, parseInt(this.ctx2d.font) + 2);
            } else if (alignment == "left") {
                this.ctx2d.fillRect(x - 2, y - (parseInt(this.ctx2d.font) / 2), this.ctx2d.measureText(text).width + 4, parseInt(this.ctx2d.font) + 2);
            }
        }

        // actual text
        this.ctx2d.font = this.settings.axisNumbers.font;
        this.ctx2d.fillStyle = this.settings.axisNumbers.colour;
        this.ctx2d.fillText(text, x, y);
    }

    /**
     * Sets up the graph variables, event listeners, and properties.
     */
    setupGraph() {

        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx2d = this.canvas.getContext("2d");

        this.graphProperties = new GraphProperties(
            this.canvas.height / this.settings.optimalPixelsBetweenIntervals,
            -this.canvas.height / this.settings.optimalPixelsBetweenIntervals,
            -this.canvas.width / this.settings.optimalPixelsBetweenIntervals,
            this.canvas.width / this.settings.optimalPixelsBetweenIntervals,
            this
        );

        this.graphProperties.reset();
        this.graphProperties.calculate();

        // handle zooming
        this.canvas.addEventListener("wheel", function (wheel) {
            if (wheel.deltaY > 0) {
                graph.canvas.style.cursor = "zoom-out";
                graph.resize(graph.settings.scrollMultiplier, graph.settings.scrollMultiplier, wheel.offsetX, wheel.offsetY);
            } else {
                graph.canvas.style.cursor = "zoom-in";
                graph.resize(1 / graph.settings.scrollMultiplier, 1 / graph.settings.scrollMultiplier, wheel.offsetX, wheel.offsetY);
            }
        });

        // for debugging
        this.canvas.addEventListener("click", function (click) {
            //console.log("Clicked on: ", graph.getPointFromCoordinates(click.offsetX, click.offsetY));
        });

        // handle panning
        this.canvas.addEventListener("mousedown", function (mousedown) {
            graph.canvas.style.cursor = "move";
            var lastX = mousedown.x;
            var lastY = mousedown.y;
            graph.panGraph(0, 0, true);
            var mousemoveListener = function (mousemove) {
                graph.panGraph(lastX - mousemove.x, mousemove.y - lastY, false);
                lastX = mousemove.x;
                lastY = mousemove.y;
            };
            var mouseupListener = function mouseupListener(mouseup) {
                graph.stopPanGraph();
                mousedown.target.style.cursor = "default";
                graph.canvas.removeEventListener("mousemove", mousemoveListener);
                graph.canvas.removeEventListener("mouseup", mouseupListener);
                graph.canvas.removeEventListener("mouseleave", mouseupListener);
            };
            graph.canvas.addEventListener("mousemove", mousemoveListener);
            graph.canvas.addEventListener("mouseup", mouseupListener);
            graph.canvas.addEventListener('mouseleave', mouseupListener);
        });

        this.drawGraph();
    }

    /**
     * Draws the graph to the canvas.
     */
    drawGraph() {

        // Clear tne canvas
        this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.graphProperties.calculate();

        // Fill background of canvas
        this.ctx2d.fillStyle = this.settings.backgroundColour;
        this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rectangles at the four corner of the canvas
        this.ctx2d.fillStyle = RED;
        this.ctx2d.fillRect(0, 0, 5, 5);
        this.ctx2d.fillRect(this.canvas.width - 5, 0, 5, 5);
        this.ctx2d.fillRect(0, this.canvas.height - 5, 5, 5);
        this.ctx2d.fillRect(this.canvas.width - 5, this.canvas.height - 5, 5, 5);

        // Set up gridlines
        this.ctx2d.strokeStyle = BLACK;
        this.ctx2d.lineWidth = this.settings.minorGridlineWidth;

        // draw vertical lines

        let leftMostLinePos = this.graphProperties.originPos.x + (Util.towardZero(this.graphProperties.leftPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalX);

        let rightMostLinePos = this.graphProperties.originPos.x + (Util.towardZero(this.graphProperties.rightPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalX);

        let majorIntervalXCount = ((-1 * Util.towardZero(this.graphProperties.leftPoint / this.graphProperties.optimalScaleX)) % this.graphProperties.minorBetweenMajorX + this.graphProperties.minorBetweenMajorX) % this.graphProperties.minorBetweenMajorX;

        for (let x = leftMostLinePos; x <= rightMostLinePos; x += this.graphProperties.pixelIntervalX) {
            var lineX = Math.round(x) - 0.5;
            if (majorIntervalXCount == 0) {
                this.ctx2d.lineWidth = this.settings.majorGridlineWidth;
                majorIntervalXCount = this.graphProperties.minorBetweenMajorX;
            } else {
                this.ctx2d.lineWidth = this.settings.minorGridlineWidth;
            }
            majorIntervalXCount--;
            this.ctx2d.beginPath();
            this.ctx2d.moveTo(lineX, 0);
            this.ctx2d.lineTo(lineX, this.canvas.height);
            this.ctx2d.stroke();
        }

        // draw horizontal lines

        let topMostLinePos = this.graphProperties.originPos.y - (Util.towardZero(this.graphProperties.topPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalY);

        let bottomMostLinePos = this.graphProperties.originPos.y - (Util.towardZero(this.graphProperties.bottomPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalY);

        let majorIntervalYCount = ((Util.towardZero(this.graphProperties.topPoint / this.graphProperties.optimalScaleY)) % this.graphProperties.minorBetweenMajorY + this.graphProperties.minorBetweenMajorY) % this.graphProperties.minorBetweenMajorY;

        for (let y = topMostLinePos; y <= bottomMostLinePos; y += this.graphProperties.pixelIntervalY) {
            var lineY = Math.round(y) - 0.5;
            if (majorIntervalYCount == 0) {
                this.ctx2d.lineWidth = this.settings.majorGridlineWidth;
                majorIntervalYCount = this.graphProperties.minorBetweenMajorX;
            } else {
                this.ctx2d.lineWidth = this.settings.minorGridlineWidth;
            }
            majorIntervalYCount--;
            this.ctx2d.beginPath();
            this.ctx2d.moveTo(0, lineY);
            this.ctx2d.lineTo(this.canvas.width, lineY);
            this.ctx2d.stroke();
        }

        // draw centre dot
        this.ctx2d.fillStyle = RED;
        this.ctx2d.beginPath();
        this.ctx2d.arc(this.graphProperties.originPos.x, this.graphProperties.originPos.y, 3, 0, 2 * Math.PI);
        this.ctx2d.fill();

        // vertical axis line
        this.ctx2d.lineWidth = this.settings.axisGridlineWidth;
        this.ctx2d.beginPath();
        this.ctx2d.moveTo(Math.round(this.graphProperties.originPos.x) - 0.5, 0);
        this.ctx2d.lineTo(Math.round(this.graphProperties.originPos.x) - 0.5, this.canvas.width);
        this.ctx2d.stroke();

        //horizontal axis line
        this.ctx2d.lineWidth = this.settings.axisGridlineWidth;
        this.ctx2d.beginPath();
        this.ctx2d.moveTo(0, Math.round(this.graphProperties.originPos.y) - 0.5);
        this.ctx2d.lineTo(this.canvas.width, Math.round(this.graphProperties.originPos.y) - 0.5);
        this.ctx2d.stroke();

        // draw horizontal scale gridlines

        let xAxisVisible;
        let labelYPos;
        let labelYAlign;

        if ((this.graphProperties.topPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalY < 0) {
            // x axis off the screen on the top side
            xAxisVisible = false;
            labelYPos = 5;
            labelYAlign = "top";
        } else if ((this.graphProperties.bottomPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalY > 0) {
            // x axis off the screen on the bottom side
            xAxisVisible = false;
            labelYPos = this.height - 5;
            labelYAlign = "bottom";
        } else {
            // x axis on the screen
            xAxisVisible = true;
            labelYPos = this.graphProperties.originPos.y + 5;
            labelYAlign = "top";
        }

        let leftMostMajorLine = Math.floor((Math.floor(this.graphProperties.leftPoint / this.graphProperties.optimalScaleX) * this.graphProperties.optimalScaleX) / (this.graphProperties.minorBetweenMajorX * this.graphProperties.optimalScaleX)) * (this.graphProperties.minorBetweenMajorX * this.graphProperties.optimalScaleX);

        // determine the Y position of the horizontal labels

        for (let x = leftMostMajorLine; x < this.graphProperties.rightPoint; x += this.graphProperties.minorBetweenMajorX * this.graphProperties.optimalScaleX) {
            if (Math.abs(x * (this.graphProperties.pixelIntervalX / this.graphProperties.optimalScaleX)) > 1) {
                this.drawScaleNumbersWithBackground(this.getScaleNumber(x), this.graphProperties.originPos.x + x * (this.graphProperties.pixelIntervalX / this.graphProperties.optimalScaleX), labelYPos, "horizontal", labelYAlign);
            }
        }

        // draw vertical scale gridlines

        let yAxisVisible;
        let labelXPos;
        let labelXAlign;

        if ((this.graphProperties.leftPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalX > 0) {
            // y axis off the screen on the left side
            yAxisVisible = false;
            labelXPos = 5;
            labelXAlign = "left";
        } else if ((this.graphProperties.rightPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalX < 0) {
            // y axis off the screen on the right side
            yAxisVisible = false;
            labelXPos = this.width - 5;
            labelXAlign = "right";
        } else {
            // y axis on the screen
            yAxisVisible = true;
            labelXPos = this.graphProperties.originPos.x - 5;
            labelXAlign = "right";
        }

        let topMostMajorLine = Math.floor((Math.floor(this.graphProperties.topPoint / this.graphProperties.optimalScaleY) * this.graphProperties.optimalScaleY) / (this.graphProperties.minorBetweenMajorY * this.graphProperties.optimalScaleY)) * (this.graphProperties.minorBetweenMajorY * this.graphProperties.optimalScaleY);


        for (let y = topMostMajorLine; y > this.graphProperties.bottomPoint; y -= this.graphProperties.minorBetweenMajorY * this.graphProperties.optimalScaleY) {
            // prevent overlapping scale labels if both scales are shown on edge
            let yAxisPos = this.graphProperties.originPos.y - y * (this.graphProperties.pixelIntervalY / this.graphProperties.optimalScaleY)
            if (yAxisVisible || (yAxisPos > 30 && yAxisPos < this.height - 30)) {
                if (Math.abs(y * (this.graphProperties.pixelIntervalY / this.graphProperties.optimalScaleY)) > 1) {
                    this.drawScaleNumbersWithBackground(this.getScaleNumber(y), labelXPos, this.graphProperties.originPos.y - y * (this.graphProperties.pixelIntervalY / this.graphProperties.optimalScaleY), "vertical", labelXAlign);
                }
            }
        }
    }

    /**
     * Pans the graph.
     * 
     * @param {Number} xMovePix     Number of pixels to move right (negative to move left).
     * @param {Number} yMovePix     Number of pixels to move down (negative to move up).
     */
    panGraph(xMovePix, yMovePix, start) {

        let now = performance.now();

        if (!start) {
            // stop pan inertia if any already exists
            if (this.panInertiaAnimation != undefined) {
                this.panInertiaAnimation.kill();
            }
            // get the velocity that the mouse moved at
            let timeElapsed = now - this.lastPanTime;
            this.panVelocity = new Point();
            this.panVelocity.x = xMovePix / (timeElapsed / 1000);
            this.panVelocity.y = yMovePix / (timeElapsed / 1000);
        }

        // update the last time that the mouse velocity was updated
        this.lastPanTime = now;

        // calculate how much to pan the graph
        let xMove = xMovePix / this.graphProperties.pixelIntervalX;
        let yMove = yMovePix / this.graphProperties.pixelIntervalY;

        // update the boundaries of the graph after the pan
        this.graphProperties.leftPoint += xMove * this.graphProperties.scaleX;
        this.graphProperties.rightPoint += xMove * this.graphProperties.scaleX;
        this.graphProperties.topPoint += yMove * this.graphProperties.scaleY;
        this.graphProperties.bottomPoint += yMove * this.graphProperties.scaleY;

        // draw the graph after the pan
        this.drawGraph();
    }

    /**
     * Called when panning of the graph is stopped and pan inertia should take over.
     */
    stopPanGraph() {

        if (this.panVelocity != undefined && (this.panVelocity.x != 0 || this.panVelocity.y != 0)) {
            this.panInertiaAnimation = TweenMax.to(
                this.panVelocity,
                this.settings.panInertia.animationLength,
                {
                    x: 0,
                    y: 0,
                    ease: Expo.easeOut,
                    onUpdate: this.continuePanGraph,
                    onUpdateScope: this,
                }
            );
        }
    }

    /**
     * Called each time pan inertia will cause the graph to be panned.
     */
    continuePanGraph() {
        let now = performance.now();
        let timeElapsed = now - this.lastPanTime;
        this.lastPanTime = now;

        // stops panning when the pan inertia velociy is too low (below stopPanValue)

        let moveX;
        if (Math.abs(this.panVelocity.x) > this.settings.panInertia.stopPanValue) {
            moveX = this.panVelocity.x * (timeElapsed / 1000);
        } else {
            moveX = 0;
        }

        let moveY;
        if (Math.abs(this.panVelocity.y) > this.settings.panInertia.stopPanValue) {
            moveY = this.panVelocity.y * (timeElapsed / 1000);
        } else {
            moveY = 0;
        }

        this.panGraph(moveX, moveY, true);
    }

    /**
     * Takes a number and formats it into a string to be displayed as a scale label.
     * 
     * @param {Number} num      The number of be displayed.
     */
    getScaleNumber(num) {
        if (Util.isIntegerPosition(num)) {
            if (Math.log10(Math.abs(num)) > this.settings.axisNumbers.maxPlaces) {
                return num.toExponential(this.settings.axisNumbers.percision);
            } else {
                return Math.round(num);
            }
        } else {
            if (Math.abs(Math.log10(Math.abs(num))) > this.settings.axisNumbers.maxPlaces) {
                return num.toExponential(this.settings.axisNumbers.percision);
            } else {
                return parseFloat(num.toPrecision(this.settings.axisNumbers.percision));
            }
        }
    }

    /**
     * Resizes the graph.
     * 
     * @param {Number} xTimes       Times to scale the X axis.
     * @param {Number} yTimes       Times to scale the Y axis.
     * @param {Number} centreX      The X position of the centre point of resizing.
     * @param {Number} centreY      The Y position of the centre point of resizing.
     */
    resize(xTimes, yTimes, centreX, centreY) {

        // prevent zooming if too far from origin
        let maxDisFromOrigin = Math.max(
            (this.graphProperties.leftPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalX,
            (this.graphProperties.rightPoint / this.graphProperties.optimalScaleX) * this.graphProperties.pixelIntervalX,
            (this.graphProperties.topPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalY,
            (this.graphProperties.bottomPoint / this.graphProperties.optimalScaleY) * this.graphProperties.pixelIntervalY);

        let maxCoordinate = Math.max(
            this.graphProperties.leftPoint,
            this.graphProperties.rightPoint,
            this.graphProperties.topPoint,
            this.graphProperties.bottomPoint
        )

        if ((maxCoordinate < this.settings.maxCoordinate || (xTimes < 1 && yTimes < 1)) && (maxDisFromOrigin < this.settings.maxZoomLimitPixelsFromOrigin || (xTimes > 1 && yTimes > 1))) {

            // stop pan inertia if any already exists
            if (this.panInertiaAnimation != undefined) {
                this.panInertiaAnimation.kill();
            }

            let mousePoint = this.getPointFromCoordinates(centreX, centreY);

            // percent of the height covered above the mouse
            let topPercent = centreY / this.height;
            // percent of the width covered left of the mosue
            let leftPercent = centreX / this.width;
            // width of the graph in terms of coordinates
            let pointWidth = this.graphProperties.rightPoint - this.graphProperties.leftPoint;
            // height of the graph in terms of coordiantes
            let pointHeight = this.graphProperties.topPoint - this.graphProperties.bottomPoint;

            // determine target boundaries of graph after the zoom
            this.animationTargetProperties = new GraphProperties(
                mousePoint.y + (pointHeight * topPercent * yTimes),
                mousePoint.y - (pointHeight * (1 - topPercent) * yTimes),
                mousePoint.x - (pointWidth * leftPercent * xTimes),
                mousePoint.x + (pointWidth * (1 - leftPercent) * xTimes),
                this
            );

            // animate the zoom
            TweenMax.to(
                this.graphProperties,
                this.settings.resizeAnimationLength,
                {
                    topPoint: this.animationTargetProperties.topPoint,
                    bottomPoint: this.animationTargetProperties.bottomPoint,
                    leftPoint: this.animationTargetProperties.leftPoint,
                    rightPoint: this.animationTargetProperties.rightPoint,
                    onUpdate: this.drawGraph,
                    onUpdateScope: this,
                    onComplete: function () {
                        this.canvas.style.cursor = "default";
                    },
                    onCompleteScope: this
                }
            );
        }
    }
}

/**
 * Default settings for graph.
 * @property {String} backgroundColour                  Background colour of the graph.
 * @property {Number} xScale                            Scale for for the coordinates on the X axis.
 * @property {Number} yScale                            Scale for for the coordinates on the Y axis.
 * @property {String} gridlineColour                    Colour of the gridlines.
 * @property {Number} minorGridlineWidth                Line width of minor gridlines.
 * @property {Number} majorGridlineWidth                Line width of major gridlines.
 * @property {Number} axisGridlineWdith                 Line width of axis gridlines.
 * @property {Number} scrollMultiplier                  Number of times to zoom in/out on each scroll.
 * @property {Number} optimalPixelsBetweenIntervals     Preferred number of pixels between each minor interval.
 * @property {Object} optimalIntervals                  A list of preferred interval multiples in the format of {multiple: number of minor gridlines between major gridlines}
 * @property {Number} resizeAnimationLength             Number of seconds for the resize animation.
 * @property {Object} axisNumbers                       Settings for the axis numbers.
 * @property {String} axisNumbers.font                  Font of the axis numbers.
 * @property {String} axisNumbers.background            Background colour of the axis numbers.
 * @property {String} axisNumbers.colour                Font colour of the axis numbers.
 * @property {Number} axisNumbers.maxPlaces             Maximum number of places for a scale number before displaying in scientific notation.
 * @property {Number} axisNumbers.percision             Number of places to display in scientific notation.
 * @property {Object} panInertia                        Settings for pan inertia.
 * @property {Number} panInertia.panAnimationLength     Number of seconds for the pan inertia animation.
 * @property {Number} panInertia.stopPanValue           Value to stop pan inertia when reached.
 * @property {Number} maxZoomLimitPixelsFromOrigin      Maximum number of pixels from the origin to prevent floating point errors.
 * @property {Number} maxCoordinate                     Maximum coordinate that can be safely displayed.
 */
const DEFAULT_SETTINGS = {
    backgroundColour: "#F0F0F0", // grey
    xScale: 1,
    yScale: 1,
    gridlineColour: "#000000", //black
    minorGridlineWidth: 0.2,
    majorGridlineWidth: 0.7,
    axisGridlineWidth: 1.5,
    scrollMultiplier: 1.5,
    optimalPixelsBetweenIntervals: 30,
    optimalIntervals: {
        1: 5,
        2: 4,
        5: 5,
        10: 5
    },
    resizeAnimationLength: 0.2,
    axisNumbers: {
        font: "12px Arial",
        background: "#F0F0F0", // grey
        colour: "#000000", // black
        maxPlaces: 4,
        percision: 3
    },
    panInertia: {
        animationLength: 1,
        stopPanValue: 100
    },
    maxZoomLimitPixelsFromOrigin: 1e10,
    maxCoordinate: 1e300
};

const BLACK = "#000000";
const RED = "#FF0000";

var graph;

function displayGraph() {

    var graphCanvas = $("#graph")[0];
    var workspace = $("#workspace")[0];
    var tools = $("#tools")[0];

    var graphHeight = workspace.getBoundingClientRect().height;
    var graphWidth = workspace.getBoundingClientRect().width - tools.offsetWidth;
    graph = new Graph(graphCanvas, DEFAULT_SETTINGS, graphWidth, graphHeight);
}