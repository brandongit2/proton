import {Point} from './Point';

describe('Testing Point.js', () => {
    it('accessing x value of Point', () => {
        const point = new Point(2, 2);
        expect(point.x).toBe(2);
    });
    it('accessing y value of Point', () => {
        const point = new Point(2, 2);
        expect(point.y).toBe(2);
    });
});

