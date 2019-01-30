var seed = Date.now();

function xorShift()
{
    let x = seed;
    x ^= x << 13;
    x ^= x >>> 7;
    x ^= x << 17;
    seed = x;
    return (x > 0)? x: x * -1;
}

module.exports = xorShift;
