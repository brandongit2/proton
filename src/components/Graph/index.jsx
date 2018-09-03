import PropTypes from 'prop-types';
import React from 'react';
import {Point} from './Point';
import {Util} from './Util';

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

        const canvasElement = (<canvas width={10} height={10} ref={c => { this.canvas = c; }} />);

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
        if (this.canvas.width !== this.canvas.offsetWidth || this.canvas.height !== this.canvas.offsetHeight) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            const ctx = this.canvas.getContext('2d');
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
                } else if (labelYPos + labelHeight + (properties.axisNumbers.margin * 2) > this.height) {
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

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 10, 10);
            ctx.fillRect(this.canvas.width - 10, 0, 10, 10);
            ctx.fillRect(0, this.canvas.height - 10, 10, 10);
            ctx.fillRect(this.canvas.width - 10, this.canvas.height - 10, 10, 10);
        });
    }

    render() {
        return (
            <div className="graph" ref={this.self} style={{flexGrow: this.props.properties.size}}>
                {this.state.canvas}
            </div>
        );
    }
}

Graph.propTypes = {
    properties: PropTypes.object.isRequired
};
