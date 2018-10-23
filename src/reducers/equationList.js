function processInput(raw, lastTypedChar = '', caretPos = 0) {
    let newRaw = raw;
    let newCaretPos = caretPos;

    newCaretPos += 1;
    switch (lastTypedChar) {
        case '(':
            newRaw += ')';
            break;
        case ')':
            if (raw.charAt(caretPos + 1) === ')') {
                newRaw = raw.substring(0, caretPos) + raw.substring(caretPos + 1);
            }
            break;
        case '{':
            newRaw += '}';
            break;
        case '}':
            if (raw.charAt(caretPos + 1) === '}') {
                newRaw = raw.substring(0, caretPos) + raw.substring(caretPos + 1);
            }
            break;
        case '[':
            newRaw += ']';
            break;
        case ']':
            if (raw.charAt(caretPos + 1) === ']') {
                newRaw = raw.substring(0, caretPos) + raw.substring(caretPos + 1);
            }
            break;
    }

    return [newRaw, newCaretPos];
}

function rawToKatex([raw, caretPos]) {
    let newCaretPos = caretPos;

    let process = str => {
        let katex = str;
        let originalKatex = katex;

        katex = katex.replace(/\\/gu, String.raw`\backslash `);
        katex = katex.replace(/\{/gu, String.raw`\{`);
        katex = katex.replace(/\}/gu, String.raw`\}`);

        // Greek letters (minus omicron)
        katex = katex.replace(/alpha/gu, '\\alpha ');
        katex = katex.replace(/beta/gu, '\\beta ');
        katex = katex.replace(/gamma/gu, '\\gamma ');
        katex = katex.replace(/delta/gu, '\\delta ');
        katex = katex.replace(/epsilon/gu, '\\epsilon ');
        katex = katex.replace(/zeta/gu, '\\zeta ');
        katex = katex.replace(/(?<!b|th|z|Th|Z)eta/gu, '\\eta ');
        katex = katex.replace(/theta/gu, '\\theta ');
        katex = katex.replace(/iota/gu, '\\iota ');
        katex = katex.replace(/kappa/gu, '\\kappa ');
        katex = katex.replace(/lambda/gu, '\\lambda ');
        katex = katex.replace(/mu/gu, '\\mu ');
        katex = katex.replace(/nu/gu, '\\nu ');
        katex = katex.replace(/xi/gu, '\\xi ');
        katex = katex.replace(/pi/gu, '\\pi ');
        katex = katex.replace(/rho/gu, '\\rho ');
        katex = katex.replace(/sigma/gu, '\\sigma ');
        katex = katex.replace(/tau/gu, '\\tau ');
        katex = katex.replace(/upsilon/gu, '\\upsilon ');
        katex = katex.replace(/phi/gu, '\\phi ');
        katex = katex.replace(/chi/gu, '\\chi ');
        katex = katex.replace(/(?!(?<=e|u|U)psilon)psi/gu, '\\psi '); // Lookahead is to prevent matching ePSIlon or uPSIlon
        katex = katex.replace(/omega/gu, '\\omega ');

        // Most capital Greek letters are omitted from this list as they look
        // identical to Latin letters.
        katex = katex.replace(/Gamma/gu, '\\Gamma ');
        katex = katex.replace(/Delta/gu, '\\Delta ');
        katex = katex.replace(/Theta/gu, '\\Theta ');
        katex = katex.replace(/Lambda/gu, '\\Lambda ');
        katex = katex.replace(/Xi/gu, '\\Xi ');
        katex = katex.replace(/Pi/gu, '\\Pi ');
        katex = katex.replace(/Sigma/gu, '\\Sigma ');
        katex = katex.replace(/Phi/gu, '\\Phi ');
        katex = katex.replace(/Psi/gu, '\\Psi ');
        katex = katex.replace(/Omega/gu, '\\Omega ');
        originalKatex = katex;

        // Common functions
        let funcs = '(sin|cos|tan|asin|acos|atan|csc|sec|cot|log|ln|sqrt)';
        katex = katex.replace(new RegExp(funcs, 'gu'), String.raw`\$1`);
        let i = 0;
        do {
            originalKatex = katex;
            katex = katex.replace(new RegExp(String.raw`${funcs}((\^|_)\w+)?(?!\{)(\(.*\))?`, 'u'), String.raw`$1$2$4`); // For functions with brackets
            i++;
        } while (katex !== originalKatex && i < 100); // In order to prevent nesting from going too deeply and crashing
        if (i >= 100) console.error('infinite loop');
        i = 0;
        do {
            originalKatex = katex;
            katex = katex.replace(new RegExp(String.raw`${funcs}(?! *(\^|_|\(|\{))((\w|\^|\\)*)`, 'u'), String.raw`$1{$3}`); // For functions without brackets
            i++;
        } while (katex !== originalKatex && i < 100); // In order to prevent nesting from going too deeply and crashing
        if (i >= 100) console.error('infinite loop');
        originalKatex = katex;

        i = 0;
        do {
            originalKatex = katex;
            katex = katex.replace(/\^(?!\{)((\w|\^)*)/u, String.raw`^{$1}`);
            i++;
        } while (katex !== originalKatex && i < 100); // In order to prevent nesting from going too deeply and crashing
        if (i >= 100) console.error('infinite loop');
        katex = katex.replace(/\*/gu, String.raw`\cdot `);

        return katex;
    };

    let katex = process(raw);

    return [raw, katex, newCaretPos];
}

function equationList(state = {}, action) {
    switch (action.type) {
        case 'ADD_EQUATION':
            return {
                ...state,
                [action.id]: {
                    raw:      '',
                    katex:    '',
                    caretPos: 0
                }
            };
        case 'ADD_TO_EQAUTION': {
            let caretPos = state[action.id].caretPos;
            let lastTypedChar = action.chars.slice(-1);
            let newValue =
                state[action.id].raw.substring(0, caretPos)
                + action.chars
                + state[action.id].raw.substring(caretPos);
            let processed = processInput(newValue, lastTypedChar, caretPos);
            processed = rawToKatex(processed);
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    raw:      processed[0],
                    katex:    processed[1],
                    caretPos: processed[2]
                }
            };
        }
        case 'BACKSPACE': {
            let caretPos = state[action.id].caretPos;
            let deletedChar = state[action.id].raw.charAt(caretPos - 1);

            let numCharsForDeletionAhead = 0;
            let numCharsForDeletionBehind = action.numChars;

            if (
                (deletedChar === '(' && state[action.id].raw.charAt(caretPos) === ')')
                || (deletedChar === '{' && state[action.id].raw.charAt(caretPos) === '}')
                || (deletedChar === '[' && state[action.id].raw.charAt(caretPos) === ']')
            ) {
                numCharsForDeletionAhead += 1;
            }

            let newValue =
                state[action.id].raw.substring(0, caretPos - numCharsForDeletionBehind)
                + state[action.id].raw.substring(caretPos + numCharsForDeletionAhead);
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    raw:      newValue,
                    katex:    rawToKatex(processInput(newValue))[1],
                    caretPos: caretPos - numCharsForDeletionBehind
                }
            };
        }
        case 'FOCUS_EQUATION':
            return {
                ...state,
                focused: action.id
            };
        case 'MOVE_CARET':
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    caretPos: action.position
                }
            };
    }

    return state;
}

export default equationList;
