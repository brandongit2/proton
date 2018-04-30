const POSITION_ERROR_THRESHOLD = 1e-10;

function Util() { }

Util.isIntegerPosition = function (position) {
    return Math.abs(Math.round(position) - position) / Math.abs(position) < POSITION_ERROR_THRESHOLD;
};

Util.isSamePosition = function (position1, position2) {
    return Math.abs(position1 - position2) / Math.max(position1, position2) < POSITION_ERROR_THRESHOLD;
};

Util.floatEquals = function (float1, float2) {
    return Math.abs(float1 - float2) < Number.EPSILON;
};

Util.floatEqualsZero = function (float1) {
    return Math.abs(float1) < Number.EPSILON;
};

Util.getMantissa = function (number) {
    return number / (Math.pow(10, Math.floor(Math.log10(number))));
};

Util.awayFromZero = function (number) {
    return Math.sign(number) * Math.ceil(Math.abs(number));
};

Util.towardZero = function (number) {
    return Math.sign(number) * Math.floor(Math.abs(number));
};
