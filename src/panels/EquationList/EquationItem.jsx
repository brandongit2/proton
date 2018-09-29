import PropTypes from 'prop-types';
import React from 'react';

import {Katex} from '../../components';

export class EquationItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keysPressed: {
                Escape:             false,
                F1:                 false,
                F2:                 false,
                F3:                 false,
                F4:                 false,
                F5:                 false,
                F6:                 false,
                F7:                 false,
                F8:                 false,
                F9:                 false,
                F10:                false,
                F11:                false,
                F12:                false,
                PrintScreen:        false,
                Insert:             false,
                Delete:             false,
                '`':                false,
                1:                  false,
                2:                  false,
                3:                  false,
                4:                  false,
                5:                  false,
                6:                  false,
                7:                  false,
                8:                  false,
                9:                  false,
                0:                  false,
                '-':                false,
                '=':                false,
                Backspace:          false,
                Tab:                false,
                q:                  false,
                w:                  false,
                e:                  false,
                r:                  false,
                t:                  false,
                y:                  false,
                u:                  false,
                i:                  false,
                o:                  false,
                p:                  false,
                '[':                false,
                ']':                false,
                '\\':               false,
                CapsLock:           false,
                a:                  false,
                s:                  false,
                d:                  false,
                f:                  false,
                g:                  false,
                h:                  false,
                j:                  false,
                k:                  false,
                l:                  false,
                ':':                false,
                '\'':               false,
                Enter:              false,
                Shift:              false,
                z:                  false,
                x:                  false,
                c:                  false,
                v:                  false,
                b:                  false,
                n:                  false,
                m:                  false,
                ',':                false,
                '.':                false,
                '/':                false,
                Control:            false,
                Meta:               false,
                Alt:                false,
                ' ':                false,
                ArrowLeft:          false,
                ArrowUp:            false,
                ArrowDown:          false,
                ArrowRight:         false,
                '~':                false,
                '!':                false,
                '@':                false,
                '#':                false,
                $:                  false,
                '%':                false,
                '^':                false,
                '&':                false,
                '*':                false,
                '(':                false,
                ')':                false,
                _:                  false,
                '+':                false,
                Q:                  false,
                W:                  false,
                E:                  false,
                R:                  false,
                T:                  false,
                Y:                  false,
                U:                  false,
                I:                  false,
                O:                  false,
                P:                  false,
                '{':                false,
                '}':                false,
                '|':                false,
                A:                  false,
                S:                  false,
                D:                  false,
                F:                  false,
                G:                  false,
                H:                  false,
                J:                  false,
                K:                  false,
                L:                  false,
                ';':                false,
                '"':                false,
                Z:                  false,
                X:                  false,
                C:                  false,
                V:                  false,
                B:                  false,
                N:                  false,
                M:                  false,
                '<':                false,
                '>':                false,
                '?':                false,
                AudioVolumeMute:    false,
                AudioVolumeDown:    false,
                AudioVolumeUp:      false,
                MediaTrackPrevious: false,
                MediaPlayPause:     false,
                MediaTrackNext:     false,
                ScrollLock:         false,
                ContextMenu:        false,
                Home:               false,
                PageUp:             false,
                PageDown:           false,
                End:                false
            }
        };

        this.item = React.createRef();

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    componentDidMount() {
        console.log(this.props.isFocused);
        if (this.props.isFocused) {
            console.log('focusing');
            this.item.current.focus();
        }
    }

    keyDown(e) {
        this.setState({
            ...this.state,
            keysPressed: {
                ...this.state.keysPressed,
                [e.key]: true
            }
        });

        let {raw, caretPos, addToEquation, backspace, moveCaret} = this.props;

        switch (e.key) {
            case 'Backspace':
                backspace(1);
                moveCaret(caretPos - 1 >= 0 ? caretPos - 1 : caretPos);
                break;
            case 'ArrowLeft':
                moveCaret(caretPos - 1 >= 0 ? caretPos - 1 : caretPos);
                break;
            case 'ArrowRight':
                moveCaret(caretPos + 1 <= raw.length ? caretPos + 1 : caretPos);
                break;
            default:
                addToEquation(e.key);
                moveCaret(caretPos + 1);
                break;
        }
    }

    keyUp(e) {
        this.setState({
            ...this.state,
            keysPressed: {
                ...this.state.keysPressed,
                [e.key]: false
            }
        });
    }

    render() {
        return (
            <div
                ref={this.item}
                className="equation-item"
                tabIndex={this.props.tabIndex}
                onClick={this.props.focus}
                onKeyDown={this.keyDown}
                onKeyUp={this.keyUp}
            >
                <Katex code={this.props.katex} />
            </div>
        );
    }
}

EquationItem.propTypes = {
    tabIndex:      PropTypes.number.isRequired,
    raw:           PropTypes.string.isRequired,
    katex:         PropTypes.string.isRequired,
    isFocused:     PropTypes.bool.isRequired,
    caretPos:      PropTypes.number.isRequired,
    focus:         PropTypes.func.isRequired,
    addToEquation: PropTypes.func.isRequired,
    backspace:     PropTypes.func.isRequired,
    moveCaret:     PropTypes.func.isRequired
};
