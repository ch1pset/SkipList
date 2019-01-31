var seed = Date.now();

//2^64-1 period XOR-Shift PRNG algorithm
//
//On it's own it is slower than Math.rand() but with conditional for getting
//absolute value of integers[-2^53, 2^53), it is faster than using Math.rand()
//and faster than Math.abs(xorShift()) and xorShift() & ~(1 << 63)
function xorShift()
{
    let x = seed;
    x ^= x << 13;
    x ^= x >>> 7; //bitshift right without preserving sign because JS is dumb
    x ^= x << 17;
    seed = x;
    return (x > 0)? x: x * -1; //this is faster than Math.abs() and using a bitmask
}

module.exports = xorShift;
