Math.TWO_PI = Math.PI * 2;
Math.clamp = function (x, min, max) {
    return Math.min(Math.max(x, min), max);
};
Math.dist = function (x1, y1, x2, y2) {
    var xd = x2 - x1;
    var yd = y2 - y1;
    return Math.sqrt(xd * xd + yd * yd);
};
Math.lerp = function (one, two, t) {
    t = Math.clamp(t, 0, 1);
    return one + ((two - one) * t);
};
