
function Timer()
{
    var start;
    const FLAGS = {SEC:0,MS:1,US:2,NS:4}
    this.reset = () => start = 0;
    this.begin = () => start = process.hrtime();
    this.end = (p) =>
    {
        let diff = process.hrtime(start);
        switch(p)
        {
            case FLAGS.SEC: return diff[0] + (diff[1] / 1000000000);
            case FLAGS.MS: return (diff[0] * 1000) + (diff[1] / 1000000);
            case FLAGS.US: return diff[1] / 1000;
            case FLAGS.NS: return diff[1];
        }
    }
}

module.exports = Timer;
