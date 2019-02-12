
var H = require('./header.js');

var list = new H.SkipList(9,4);
var timer = new H.Timer();
var timer1 = new H.Timer();
var stdio = new H.stdio();
var xorShift = H.xorShift;

var length = 1000000;
var time_elapsed = 0;
var seconds = 0;
var count = added = dups = 0;

var setPrecision = (n, s) => Number.parseFloat(n).toPrecision(s);
timer.precision(0);

function updateStatus()
{
    stdio.writeOver(`Added: ${added}`.padEnd(15, ' '));
    stdio.writeAppend(`Dups(not added): ${dups}`.padEnd(25,' '));
    stdio.writeAppend(`Time Elapsed: ${setPrecision(time_elapsed,4)}s`.padEnd(23));
}

// stdio.writeLine(`Generating list`);
updateStatus();
timer.begin();
while(count != length)
{
    let x = xorShift() % (2 * length);
    let r = list.insert(x, node => node.compare(d => d - x));
    if(r === 0)
    {
        count++;
        added++;
    }
    else dups++;
    time_elapsed = timer.lap();
    if(time_elapsed > seconds)
    {
        seconds += 1;
        updateStatus();
    }
}
time_elapsed = timer.end();
updateStatus();

stdio.onRead(() =>
{
    let parse = (str) =>
    {
        let regex = /\b[\w]+\b/ig;
        let out = arr = []
        while((arr = regex.exec(str)) !== null)
        {
            out.push(arr[0]);
        }
        return out;
    }
    let chunk;
    while((chunk = stdio.read()) !== null)
    {
        let n;
        let input = parse(chunk.toString());
        switch(input[0])
        {
            case 'find': case 'search':
            n = list.find(node => node.compare(d => d - input[1]));
            if(n) stdio.writeLine(`Found ${n.toString()}`);
            else stdio.writeLine(`Not found`);
            break;
            case 'insert': case 'add':
            n = list.insert(input[1], node => node.compare(d => d - input[1]));
            if(n === 0) stdio.writeLine(`Added`);
            else stdio.writeLine(`Duplicate, not added`);
            break;
            case 'remove': case 'delete':
            n = list.remove(node => node.compare(d => d - input[1]));
            if(n === 0) stdio.writeLine(`Removed ${input[1]}`);
            else stdio.writeLine(`Not found`);
            break;
            case 'destroy': case 'clear':
            list.destroy();
            break;
            case 'exit': case 'quit': process.exit(0); break;
        }
    }
});
