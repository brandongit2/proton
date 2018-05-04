
const OPERATORS = ['+', '-', '*', '/', 'sin', 'tan', 'cos', '(', ')'];

class Equation {

    /**
     * Turns a string representation of an equation and separates the operators and operands into individual strings in an array.
     * @param {String} equationStr      String representation of the equation
     */
    static parseEquation(equationStr) {
        let equationArr = [];
        let token = "";
        for (let i = 0; i < equationStr.length; i++) {

            let curChar = equationStr.charAt(i);

            if (curChar == " ") {
                continue;
            }

            if (Util.isNumber(token) && !Util.isNumber(curChar)) {
                if (token != "") {
                    equationArr.push(token);
                    token = "";
                }
            }

            token += curChar;

            if (OPERATORS.indexOf(token) != -1) {
                equationArr.push(token);
                token = "";
            }
        }
        if (token != "") {
            equationArr.push(token);
        }
        console.log(equationArr);
    }
}