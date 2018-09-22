import PropTypes from 'prop-types';
import React from 'react';
import {Point} from './Point';
import {Util} from './Util';
import {TweenMax, Expo} from 'gsap/all';

/*
NOTES:
    - "coordinates" and "Point" refer to actual grid coordiantes
    - "position" or "Pos" refers to the number of pixels from the upper-left corner of the canvas
*/

const EXPONENTIAL_FORM_REGEX = /(.+)e\+?(.+)/u;

export class Graph extends React.Component {
    constructor(props) {
        super(props);

        this.self = React.createRef();
        this.panInertiaAnimation = null;
        this.panVelocity = new Point(0, 0);
        this.lastPanTime = null;
        this.lastPanPos = new Point(0, 0);

        const canvasElement = (<canvas ref={c => { this.canvas = c; }} />);

        this.state = {
            display: {
                topPoint:    null,
                bottomPoint: null,
                leftPoint:   null,
                rightPoint:  null,
            },
            canvas:  canvasElement,
            context: null,
        };
    }

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        let dpr = window.devicePixelRatio || 1;
        console.log(dpr);
        let rect = this.canvas.getBoundingClientRect();
        if (this.canvas.width !== rect.width || this.canvas.height !== rect.height) {
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;

            this.canvas.addEventListener('mousedown', this.handleMouseDown);
            this.canvas.addEventListener('wheel', this.handleMouseWheel);

            const ctx = this.canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            this.setState({
                context: ctx,
                display: {
                    topPoint:    this.canvas.height / this.props.properties.optimalPixelsBetweenIntervals,
                    bottomPoint: -this.canvas.height / this.props.properties.optimalPixelsBetweenIntervals,
                    leftPoint:   -this.canvas.width / this.props.properties.optimalPixelsBetweenIntervals,
                    rightPoint:  this.canvas.width / this.props.properties.optimalPixelsBetweenIntervals,
                }
            }, () => {
                this.drawGraph();
            });
        }
    }

    calculate(cb) {
        let {topPoint, bottomPoint, leftPoint, rightPoint} = {...this.state.display};
        let {properties} = {...this.props};
        let width = this.canvas.width;
        let height = this.canvas.height;

        let targetScaleX = (rightPoint - leftPoint) / (width / properties.optimalPixelsBetweenIntervals);
        let targetScaleY = (topPoint - bottomPoint) / (height / properties.optimalPixelsBetweenIntervals);

        // determine the best multiple to use for the target scale
        let intervalX = 0;
        let intervalXDifference = Number.MAX_VALUE;
        let mantissaX = Util.getMantissa(targetScaleX);

        let intervalY = 0;
        let intervalYDifference = Number.MAX_VALUE;
        let mantissaY = Util.getMantissa(targetScaleY);

        for (let interval in properties.optimalIntervals) {
            if (Math.abs(interval - mantissaX) <= intervalXDifference) {
                intervalXDifference = Math.abs(interval - mantissaX);
                intervalX = interval;
            }
            if (Math.abs(interval - mantissaY) <= intervalYDifference) {
                intervalYDifference = Math.abs(interval - mantissaY);
                intervalY = interval;
            }
        }

        let optimalScaleX = intervalX * Math.pow(10, Math.floor(Math.log10(targetScaleX)));
        let intervalScaleX = Number.parseInt(intervalX);
        let minorBetweenMajorX = properties.optimalIntervals[intervalX];

        let optimalScaleY = intervalY * Math.pow(10, Math.floor(Math.log10(targetScaleY)));
        let intervalScaleY = Number.parseInt(intervalY);
        let minorBetweenMajorY = properties.optimalIntervals[intervalY];

        let pixelIntervalX = properties.optimalPixelsBetweenIntervals * (optimalScaleX / targetScaleX);
        let pixelIntervalY = properties.optimalPixelsBetweenIntervals * (optimalScaleY / targetScaleY);

        let centrePoint = new Point((topPoint + bottomPoint) / 2, (leftPoint + rightPoint) / 2);
        let originPos = new Point(-leftPoint * pixelIntervalY / optimalScaleY, topPoint * pixelIntervalX / optimalScaleX);

        const curState = this.state;
        curState.display = {
            ...curState.display,
            leftPoint,
            rightPoint,
            bottomPoint,
            topPoint,
            optimalScaleX,
            optimalScaleY,
            intervalScaleX,
            intervalScaleY,
            minorBetweenMajorX,
            minorBetweenMajorY,
            pixelIntervalX,
            pixelIntervalY,
            centrePoint,
            originPos
        };

        this.setState(curState, cb);
    }

    getScaleNumber(num) {
        if (Util.isIntegerPosition(num)) {
            if (Math.log10(Math.abs(num)) > this.props.properties.axisNumbers.maxPlaces) {
                return num.toExponential(this.props.properties.axisNumbers.percision).toString();
            } else {
                return Math.round(num).toString();
            }
        } else if (Math.abs(Math.log10(Math.abs(num))) > this.props.properties.axisNumbers.maxPlaces) {
            return num.toExponential(this.props.properties.axisNumbers.percision).toString();
        } else {
            return parseFloat(num.toPrecision(this.props.properties.axisNumbers.percision)).toString();
        }
    }

    drawScaleNumbersWithBackground(text, x, y, axis, alignment) {
        let ctx = this.state.context;
        let {properties} = {...this.props};
        let bgBoxX, bgBoxY, bgBoxWidth, bgBoxHeight;

        let regexMatch = EXPONENTIAL_FORM_REGEX.exec(text);

        if (regexMatch === null) {
            // label is NOT in exponential form

            ctx.font = properties.axisNumbers.font;
            let textWidth = ctx.measureText(text).width;

            if (axis === 'horizontal') {
                // horizontal axis
                ctx.textAlign = 'center';
                ctx.textBaseline = alignment;
                bgBoxX = x - (textWidth / 2) - properties.axisNumbers.padding;
                bgBoxWidth = textWidth + (properties.axisNumbers.padding * 2);
                bgBoxHeight = parseInt(properties.axisNumbers.font) + (properties.axisNumbers.padding * 2);
                if (alignment === 'top') {
                    bgBoxY = y - properties.axisNumbers.padding;
                } else if (alignment === 'bottom') {
                    bgBoxY = y - parseInt(properties.axisNumbers.font) - properties.axisNumbers.padding * 2;
                }
            } else {
                // vertical axis
                ctx.textAlign = alignment;
                ctx.textBaseline = 'middle';
                bgBoxY = y - (parseInt(properties.axisNumbers.font) / 2) - properties.axisNumbers.padding;
                bgBoxWidth = textWidth + (properties.axisNumbers.padding * 2);
                bgBoxHeight = parseInt(properties.axisNumbers.font) + (properties.axisNumbers.padding * 2);
                if (alignment === 'right') {
                    bgBoxX = x - textWidth - properties.axisNumbers.padding;
                } else if (alignment === 'left') {
                    bgBoxX = x - properties.axisNumbers.padding;
                }
            }

            // background of text
            ctx.fillStyle = properties.axisNumbers.background;
            ctx.fillRect(bgBoxX, bgBoxY, bgBoxWidth, bgBoxHeight);

            // actual text
            ctx.font = properties.axisNumbers.font;
            ctx.fillStyle = properties.axisNumbers.colour;
            ctx.fillText(text, x, y);
        } else {
            // label is in exponential form
            let mantissa = regexMatch[1];
            let exponent = regexMatch[2];

            let normalText = `${mantissa} \u{22C5} 10 `;
            ctx.font = properties.axisNumbers.font;
            let normalTextWidth = ctx.measureText(normalText).width;
            let normalTextTop;

            let superText = exponent;
            ctx.font = properties.axisNumbers.superscriptFont;
            let superTextWidth = ctx.measureText(superText).width;

            if (axis === 'horizontal') {
                // horizontal axis
                ctx.textAlign = 'center';
                ctx.textBaseline = alignment;
                bgBoxX = x - (normalTextWidth / 2) - properties.axisNumbers.padding;
                bgBoxWidth = normalTextWidth + superTextWidth + (properties.axisNumbers.padding * 2);
                bgBoxHeight = parseInt(properties.axisNumbers.font) + (properties.axisNumbers.padding * 2);
                if (alignment === 'top') {
                    bgBoxY = y - properties.axisNumbers.padding;
                } else if (alignment === 'bottom') {
                    bgBoxY = y - parseInt(properties.axisNumbers.font) - properties.axisNumbers.padding * 2;
                }
                // top of normal sized text to be reference point for the top of the superscripted text
                normalTextTop = bgBoxY + properties.axisNumbers.padding;

                // background of text
                ctx.fillStyle = properties.axisNumbers.background;
                ctx.fillRect(bgBoxX, bgBoxY, bgBoxWidth, bgBoxHeight);

                // actual text
                ctx.fillStyle = properties.axisNumbers.colour;
                ctx.font = properties.axisNumbers.font;
                ctx.fillText(normalText, x, y);

                ctx.font = properties.axisNumbers.superscriptFont;
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.fillText(superText, x + normalTextWidth / 2 - properties.axisNumbers.padding, normalTextTop);
            } else {
                // vertical axis
                ctx.textAlign = alignment;
                ctx.textBaseline = 'middle';
                bgBoxY = y - (parseInt(properties.axisNumbers.font) / 2) - properties.axisNumbers.padding * 2;
                bgBoxWidth = normalTextWidth + superTextWidth + (properties.axisNumbers.padding * 2);
                bgBoxHeight = parseInt(properties.axisNumbers.font) + (properties.axisNumbers.padding * 2);
                if (alignment === 'right') {
                    bgBoxX = x - normalTextWidth - superTextWidth - properties.axisNumbers.padding * 2;
                } else if (alignment === 'left') {
                    bgBoxX = x - properties.axisNumbers.padding;
                }
                // top of normal sized text to be reference point for the top of the superscripted text
                normalTextTop = bgBoxY + properties.axisNumbers.padding;

                // background of text
                ctx.fillStyle = properties.axisNumbers.background;
                ctx.fillRect(bgBoxX, bgBoxY, bgBoxWidth, bgBoxHeight);

                // actual text
                ctx.textAlign = 'left';
                ctx.fillStyle = properties.axisNumbers.colour;
                ctx.font = properties.axisNumbers.font;
                ctx.fillText(normalText, bgBoxX + properties.axisNumbers.padding, y);

                ctx.font = properties.axisNumbers.superscriptFont;
                ctx.textBaseline = 'top';
                ctx.fillText(superText, bgBoxX + normalTextWidth, normalTextTop);
            }
        }
    }

    drawGraph() {
        // Calculate gridlines
        this.calculate(() => {
            let {properties} = {...this.props};
            let {display} = {...this.state};
            let width = this.canvas.width;
            let height = this.canvas.height;
            let ctx = this.state.context;

            // Clear the canvas
            ctx.clearRect(0, 0, width, height);

            // Fill canvas with background colour
            ctx.fillStyle = properties.backgroundColour;
            ctx.fillRect(0, 0, width, height);

            // Set up gridlines
            ctx.strokeStyle = properties.axisNumbers.colour;
            ctx.lineWidth = properties.minorGridlineWidth;

            // Draw vertical lines
            let leftMostLinePos = Util.towardZero(display.leftPoint / display.optimalScaleX) * display.optimalScaleX;
            let rightMostLinePos = Util.towardZero(display.rightPoint / display.optimalScaleX) * display.optimalScaleX;

            let majorIntervalXCount = ((-1 * Util.towardZero(display.leftPoint / display.optimalScaleX)) % display.minorBetweenMajorX + display.minorBetweenMajorX) % display.minorBetweenMajorX;

            for (let xCoord = leftMostLinePos; xCoord <= rightMostLinePos; xCoord += display.optimalScaleX) {
                let x = display.originPos.x + (Math.round(xCoord / display.optimalScaleX) * display.pixelIntervalX);
                let lineX = Math.round(x) - 0.5;
                if (majorIntervalXCount === 0) {
                    ctx.lineWidth = properties.majorGridlineWidth;
                    majorIntervalXCount = display.minorBetweenMajorX;
                } else {
                    ctx.lineWidth = properties.minorGridlineWidth;
                }
                majorIntervalXCount--;
                ctx.beginPath();
                ctx.moveTo(lineX, 0);
                ctx.lineTo(lineX, height);
                ctx.stroke();
            }

            // Draw horizontal lines
            let topMostLinePos = Util.towardZero(display.topPoint / display.optimalScaleY) * display.optimalScaleY;
            let bottomMostLinePos = Util.towardZero(display.bottomPoint / display.optimalScaleY) * display.optimalScaleY;

            let majorIntervalYCount = (Util.towardZero(display.topPoint / display.optimalScaleY) % display.minorBetweenMajorY + display.minorBetweenMajorY) % display.minorBetweenMajorY;

            for (let yCoord = topMostLinePos; yCoord >= bottomMostLinePos; yCoord -= display.optimalScaleY) {
                let y = display.originPos.y - (Math.round(yCoord / display.optimalScaleY) * display.pixelIntervalY);
                let lineY = Math.round(y) - 0.5;
                if (majorIntervalYCount === 0) {
                    ctx.lineWidth = properties.majorGridlineWidth;
                    majorIntervalYCount = display.minorBetweenMajorY;
                } else {
                    ctx.lineWidth = properties.minorGridlineWidth;
                }
                majorIntervalYCount--;
                ctx.beginPath();
                ctx.moveTo(0, lineY);
                ctx.lineTo(width, lineY);
                ctx.stroke();
            }

            // Draw vertical axis line
            if (leftMostLinePos <= 0 && rightMostLinePos >= 0) {
                ctx.lineWidth = properties.axisGridlineWidth;
                ctx.beginPath();
                ctx.moveTo(Math.round(display.originPos.x), 0);
                ctx.lineTo(Math.round(display.originPos.x), height);
                ctx.stroke();
            }

            // Draw horizontal axis line
            if (topMostLinePos >= 0 && bottomMostLinePos <= 0) {
                ctx.lineWidth = properties.axisGridlineWidth;
                ctx.beginPath();
                ctx.moveTo(0, Math.round(display.originPos.y));
                ctx.lineTo(width, Math.round(display.originPos.y));
                ctx.stroke();
            }

            // Draw labels for X axis
            let leftMostMajorLine = Math.floor((Math.floor(display.leftPoint / display.optimalScaleX) * display.optimalScaleX) / (display.minorBetweenMajorX * display.optimalScaleX)) * (display.minorBetweenMajorX * display.optimalScaleX);

            for (let x = leftMostMajorLine; x < display.rightPoint; x += display.minorBetweenMajorX * display.optimalScaleX) {
                let labelXPos = display.originPos.x + x * (display.pixelIntervalX / display.optimalScaleX);
                let labelYPos = display.originPos.y;
                let labelHeight = parseInt(properties.axisNumbers.font);
                let labelYAlign;

                if (labelYPos < 0) {
                    // label is off screen on top
                    labelYPos = properties.axisNumbers.margin;
                    labelYAlign = 'top';
                } else if (labelYPos + labelHeight + (properties.axisNumbers.margin * 2) > height) {
                    // label is off the screen on bottom
                    labelYPos = height - properties.axisNumbers.margin;
                    labelYAlign = 'bottom';
                } else {
                    // label is on the screen, positioned at bottom of axis
                    labelYPos = display.originPos.y + properties.axisNumbers.margin;
                    labelYAlign = 'top';
                }

                if (Math.abs(x * (display.pixelIntervalX / display.optimalScaleX)) > 1) {
                    // only draw label if it is not 0
                    this.drawScaleNumbersWithBackground(this.getScaleNumber(x), labelXPos, labelYPos, 'horizontal', labelYAlign);
                }
            }

            // Draw labels for Y axis
            let topMostMajorLine = Math.floor((Math.floor(display.topPoint / display.optimalScaleY) * display.optimalScaleY) / (display.minorBetweenMajorY * display.optimalScaleY)) * (display.minorBetweenMajorY * display.optimalScaleY);

            for (let y = topMostMajorLine; y > display.bottomPoint; y -= display.minorBetweenMajorY * display.optimalScaleY) {
                let labelYPos = display.originPos.y - y * (display.pixelIntervalY / display.optimalScaleY);
                let labelXPos = display.originPos.x;

                // get width of label
                let labelWidth;
                let label = this.getScaleNumber(y);

                let regexMatch = EXPONENTIAL_FORM_REGEX.exec(label);

                if (regexMatch === null) {
                    labelWidth = ctx.measureText(label).width;
                } else {
                    let mantissa = regexMatch[1];
                    let exponent = regexMatch[2];

                    let normalText = `${mantissa} \u{22C5} 10 `;
                    ctx.font = properties.axisNumbers.font;
                    let normalTextWidth = ctx.measureText(normalText).width;

                    let superText = exponent;
                    ctx.font = properties.axisNumbers.superscriptFont;
                    let superTextWidth = ctx.measureText(superText).width;

                    labelWidth = normalTextWidth + superTextWidth;
                }

                let labelXAlign;

                if ((labelXPos - labelWidth - (properties.axisNumbers.margin * 2)) < 0) {
                    // label is off the screen on the left
                    labelXPos = properties.axisNumbers.margin;
                    labelXAlign = 'left';
                } else if (labelXPos > width) {
                    // label is off the screen on the right
                    labelXPos = width - properties.axisNumbers.margin;
                    labelXAlign = 'right';
                } else {
                    // label is on the left of the axis
                    labelXPos = display.originPos.x - properties.axisNumbers.margin;
                    labelXAlign = 'right';
                }

                if (Math.abs(y * (display.pixelIntervalY / display.optimalScaleY)) > 1) {
                    this.drawScaleNumbersWithBackground(label, labelXPos, labelYPos, 'vertical', labelXAlign);
                }
            }

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 10, 10);
            ctx.fillRect(this.canvas.width - 10, 0, 10, 10);
            ctx.fillRect(0, this.canvas.height - 10, 10, 10);
            ctx.fillRect(this.canvas.width - 10, this.canvas.height - 10, 10, 10);
        });
    }

    panGraph(xMovePix, yMovePix, start) {
        let {properties} = {...this.props};
        let {display} = {...this.state};
        let allowPan = true;

        // Calculate how much to pan the graph
        let xMove = xMovePix / display.pixelIntervalX;
        let yMove = yMovePix / display.pixelIntervalY;

        let newLeftPoint = display.leftPoint + xMove * display.optimalScaleX;
        let newRightPoint = display.rightPoint + xMove * display.optimalScaleX;
        let newTopPoint = display.topPoint + yMove * display.optimalScaleY;
        let newBottomPoint = display.bottomPoint + yMove * display.optimalScaleY;

        // Check if the pan will go off the safe boundaries of the graph
        if (newLeftPoint < -properties.maxCoordinate && xMovePix < 0) {
            allowPan = false;
        } else if (newRightPoint > properties.maxCoordinate && xMovePix > 0) {
            allowPan = false;
        } else if (newTopPoint > properties.maxCoordinate && yMovePix > 0) {
            allowPan = false;
        } else if (newBottomPoint < -properties.maxCoordinate && yMovePix < 0) {
            allowPan = false;
        }

        if (allowPan) {
            let now = performance.now();

            if (!start) {
                // stop pan inertia if any already exists
                if (this.panInertiaAnimation) {
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

            // update the boundaries of the graph after the pan
            display.leftPoint = newLeftPoint;
            display.rightPoint = newRightPoint;
            display.topPoint = newTopPoint;
            display.bottomPoint = newBottomPoint;

            // draw the graph after the pan
            this.drawGraph();
        }
    }

    /**
     *  Called when panning of the graph is stopped and pan inertia should take over.
     */
    stopPanGraph() {
        if (this.panVelocity && (this.panVelocity.x !== 0 || this.panVelocity.y !== 0)) {
            this.panInertiaAnimation = TweenMax.to(
                this.panVelocity,
                this.props.properties.panInertia.animationLength,
                {
                    x:             0,
                    y:             0,
                    ease:          Expo.easeOut,
                    onUpdate:      this.continuePanGraph,
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
        if (Math.abs(this.panVelocity.x) > this.props.properties.panInertia.stopPanValue) {
            moveX = this.panVelocity.x * (timeElapsed / 1000);
        } else {
            moveX = 0;
        }

        let moveY;
        if (Math.abs(this.panVelocity.y) > this.props.properties.panInertia.stopPanValue) {
            moveY = this.panVelocity.y * (timeElapsed / 1000);
        } else {
            moveY = 0;
        }

        this.panGraph(moveX, moveY, true);
    }

    handleMouseDown = e => {
        this.canvas.style.cursor = 'move';
        this.lastPanPos.x = e.x;
        this.lastPanPos.y = e.y;
        this.panGraph(0, 0, true);

        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);
    }

    handleMouseMove = e => {
        this.panGraph(this.lastPanPos.x - e.x, e.y - this.lastPanPos.y, false);
        this.lastPanPos.x = e.x;
        this.lastPanPos.y = e.y;
    }

    handleMouseUp = () => {
        this.stopPanGraph();
        this.canvas.style.cursor = 'default';
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }

    handleMouseWheel = e => {
        if (e.deltaY > 0) {
            this.canvas.style.cursor = 'zoom-out';
            this.resize(this.props.properties.scrollMultiplier, this.props.properties.scrollMultiplier, e.offsetX, e.offsetY);
        } else {
            this.canvas.style.cursor = 'zoom-in';
            this.resize(1 / this.props.properties.scrollMultiplier, 1 / this.props.properties.scrollMultiplier, e.offsetX, e.offsetY);
        }
    }

    getPointFromCoordinates(xCoord, yCoord) {
        let curPoint = new Point();
        curPoint.x = this.state.display.leftPoint + ((xCoord / this.state.display.pixelIntervalX) * this.state.display.optimalScaleX);
        curPoint.y = this.state.display.topPoint - ((yCoord / this.state.display.pixelIntervalY) * this.state.display.optimalScaleY);
        return curPoint;
    }

    resize(xTimes, yTimes, centreX, centreY) {
        let {properties} = {...this.props};
        let {display} = {...this.state};
        let width = this.canvas.width;
        let height = this.canvas.height;

        let maxDisFromOrigin = Math.max(
            (display.leftPoint / display.optimalScaleX) * display.pixelIntervalX,
            (display.rightPoint / display.optimalScaleX) * display.pixelIntervalX,
            (display.topPoint / display.optimalScaleY) * display.pixelIntervalY,
            (display.bottomPoint / display.optimalScaleY) * display.pixelIntervalY
        );

        let maxCoordinate = Math.max(
            display.leftPoint,
            display.rightPoint,
            display.topPoint,
            display.bottomPoint
        );

        if ((maxCoordinate < properties.maxCoordinate || (xTimes < 1 && yTimes < 1)) && (maxDisFromOrigin < properties.maxZoomLimitPixelsFromOrigin || (xTimes > 1 && yTimes > 1))) {
            // stop pan inertia if any already exists
            if (this.panInertiaAnimation) {
                this.panInertiaAnimation.kill();
            }

            let mousePoint = this.getPointFromCoordinates(centreX, centreY);

            // percent of the height covered above the mouse
            let topPercent = centreY / height;
            // percent of the width covered left of the mosue
            let leftPercent = centreX / width;
            // width of the graph in terms of coordinates
            let pointWidth = display.rightPoint - display.leftPoint;
            // height of the graph in terms of coordiantes
            let pointHeight = display.topPoint - display.bottomPoint;

            // determine target boundaries of graph after the zoom
            let animationTarget = {
                topPoint:    mousePoint.y + (pointHeight * topPercent * yTimes),
                bottomPoint: mousePoint.y - (pointHeight * (1 - topPercent) * yTimes),
                leftPoint:   mousePoint.x - (pointWidth * leftPercent * xTimes),
                rightPoint:  mousePoint.x + (pointWidth * (1 - leftPercent) * xTimes),
            };

            this.animationDisplay = {
                topPoint:    this.state.display.topPoint,
                bottomPoint: this.state.display.bottomPoint,
                leftPoint:   this.state.display.leftPoint,
                rightPoint:  this.state.display.rightPoint
            };

            // animate the zoom
            TweenMax.to(
                this.animationDisplay,
                properties.resizeAnimationLength,
                {
                    topPoint:    animationTarget.topPoint,
                    bottomPoint: animationTarget.bottomPoint,
                    leftPoint:   animationTarget.leftPoint,
                    rightPoint:  animationTarget.rightPoint,
                    onUpdate:    () => {
                        let curState = this.state;
                        curState.display.topPoint = this.animationDisplay.topPoint;
                        curState.display.bottomPoint = this.animationDisplay.bottomPoint;
                        curState.display.leftPoint = this.animationDisplay.leftPoint;
                        curState.display.rightPoint = this.animationDisplay.rightPoint;
                        this.setState(curState, () => {
                            this.drawGraph();
                        });
                    },
                    onUpdateScope: this,
                    onComplete:    function () {
                        this.canvas.style.cursor = 'default';
                    },
                    onCompleteScope: this
                }
            );
        }
    }

    render() {
        return (
            <div className="panel graph" ref={this.self} style={this.props.panelStyle}>
                {this.state.canvas}
            </div>
        );
    }
}

Graph.propTypes = {
    panelStyle: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired
};
