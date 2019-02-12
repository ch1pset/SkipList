
function Timer()
{
    var start;
    var precision;
    const FLAGS = {SEC:0,MS:1,US:2,NS:4}
    var calc = () =>
    {
        let diff = process.hrtime(start);
        switch(precision)
        {
            case FLAGS.SEC: return diff[0] + (diff[1] / 1000000000);
            case FLAGS.MS: return (diff[0] * 1000) + (diff[1] / 1000000);
            case FLAGS.US: return diff[1] / 1000;
            case FLAGS.NS: return diff[1];
        }
    }
    this.precision = (p) => precision = p;
    this.reset = () => start = 0;
    this.begin = () => start = process.hrtime();
    this.end = () =>
    {
        let ret = calc();
        this.reset();
        return ret;
    }
    this.lap = () => calc();
}

module.exports = Timer;
