class Expression {
    constructor(string) {
        this.changeExpression(string);
    }

    changeExpression(string) {
        this.expression = string;
    }

    execute(params) { // eslint-disable-line no-unused-vars
        try {
            let exp = this.expression;
            exp = exp.replace('^', '**');
            exp = exp.replace(/([A-Za-z]+)(?![A-Za-z]*\()/gu, 'params.$1');
            exp = exp.replace(/(sin|cos|tan|sqrt)(?=\()/u, 'Math.$1');
            console.log(exp);

            // eslint-disable-next-line no-eval
            return eval(exp).toString();
        } catch (e) {
            return 'error';
        }
    }
}

export default Expression;
