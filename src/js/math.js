
const OPERATORS = ['+', '-', '*', '/'];

class Equation {
    static parseEquation(equationStr) {
        let equationArr = [];
        let token = "";
        for (let i = 0; i < equationStr.length; i++) {

            let curChar = equationStr.charAt(i);

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