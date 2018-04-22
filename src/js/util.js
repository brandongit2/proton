const POSITION_ERROR_THRESHOLD = 1e-10;

class Util {
    static isIntegerPosition(position) {
        return Math.abs(Math.round(position) - position)/Math.abs(position) < POSITION_ERROR_THRESHOLD;
    }

    static isSamePosition(position1, position2) {
        return Math.abs(position1 - position2)/Math.max(position1, position2) < POSITION_ERROR_THRESHOLD;
    }

    static floatEquals(float1, float2) {
        return Math.abs(float1 - float2) < Number.EPSILON;
    }

    static floatEqualsZero(float1) {
        return Math.abs(float1) < Number.EPSILON;
    }

    static getMantissa(number) {
        return number/(Math.pow(10, Math.floor(Math.log10(number))));
    }
}
