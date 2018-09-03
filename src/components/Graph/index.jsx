import PropTypes from 'prop-types';
import React from 'react';
import Point from './';

export class Graph extends React.Component {
    constructor(props) {
        super(props);

        this.self = React.createRef();

        const canvasElement = (<canvas width={10} height={10} ref={c => { this.canvas = c; }} />);

        this.state = {
            bounds: {
                topPoint:    null,
                bottomPoint: null,
                leftPoint:   null,
                rightPoint:  null
            },
            settings: {

            },
            dimensions: {
                height: null,
                width:  null
            },
            canvas: canvasElement,
        };
    }

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = this.canvas.getContext('2d');
        console.log(this.self.current.clientWidth);
        this.setState({
            context:    ctx,
            dimensions: {
                height: this.self.current.clientHeight,
                width:  this.self.current.clientWidth
            }
        }, () => {
            this.canvas.height = this.state.dimensions.height;
            this.canvas.width = this.state.dimensions.width;
            console.log(this.self.current.clientWidth);

            ctx.fillStyle = '#FF0000';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
