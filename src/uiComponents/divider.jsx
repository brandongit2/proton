import PropTypes from 'prop-types';
import React from 'react';

/**
 * The space between panels.
 *
 * @returns {React.Component} A divider component.
 */
export class Divider extends React.Component {
    constructor(props) {
        super(props);

        this.beginMove = this.beginMove.bind(this);
    }

    componentDidMount() {
        this.ref.addEventListener('mousedown', this.beginMove, {passive: false});
        this.ref.addEventListener('touchstart', this.beginMove, {passive: false});
    }

    beginMove(e) {
        e.preventDefault();
        console.log('begin move');
        console.log(this.props);
        this.props.onMove(this.props.id, 2);

        const preventTextSelection = e => {
            e.preventDefault();
        };

        const endMove = e => {
            console.log('end move');

            window.removeEventListener('touchmove', preventTextSelection, {passive: false});
            window.removeEventListener('mousemove', preventTextSelection, {passive: false});

            window.removeEventListener('mouseup', endMove);
            window.removeEventListener('touchend', endMove);
        };

        window.addEventListener('mousemove', preventTextSelection, {passive: false});
        window.addEventListener('touchmove', preventTextSelection, {passive: false});

        window.addEventListener('mouseup', endMove);
        window.addEventListener('touchend', endMove);
    }

    render() {
        // Ref used in componentDidMount() method to add {passive: false} to event listener. This
        // was not possible using React's built-in synthetic event listeners.
        return <div className={this.props.className} ref={elem => { this.ref = elem; }} />;
    }
}

Divider.propTypes = {
    className: PropTypes.string.isRequired,
    id:        PropTypes.string.isRequired,
    onMove:    PropTypes.func.isRequired
};
