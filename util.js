class Util {
    
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