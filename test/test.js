
var H = require('./header.js');

var list = new H.SkipList(7,4);
var timer = new H.Timer();
var timer1 = new H.Timer();
var stdio = new H.stdio();
var xorShift = H.xorShift;

var length = 10000;
var time_elapsed = 0;
var seconds = 0;
var count = added = dups = 0;

var setPrecision = (n, s) => Number.parseFloat(n).toPrecision(s);

function updateStatus()
{
    stdio.writeOver(`Added: ${added}`.padEnd(15, ' '));
    stdio.writeAppend(`Dups(not added): ${dups}`.padEnd(25,' '));
    stdio.writeAppend(`Time Elapsed: ${setPrecision(time_elapsed,4)}s`.padEnd(23));
}

// stdio.writeLine(`Generating list`);
timer.begin();
updateStatus();
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
    time_elapsed = timer.end(0);
    if(time_elapsed > seconds)
    {
        seconds += 1;
        updateStatus();
    }
}
updateStatus();

stdio.writeLine(`Starting search tests`);

timer.reset();
timer1.begin();
var avg = avg1 = 0;
var skipFastest = linFastest = 100000;
var skipSlowest = linSlowest = 0;
for(let i = 0; i < 100; i++)
{
    let r = xorShift() % (2 * length);

    stdio.writeOver(`Searching for ${r}`.padEnd(25, ' '));
    timer.begin();
    list.find(node => node.compare(d => d - r));
    let us = timer.end(2);
    timer1.begin();
    list.findLinear(node => node.compare(d => d - r));
    let t1 = timer1.end(1);
    avg += us
    avg1 += t1;
    skipFastest = (skipFastest < us)?skipFastest:us;
    skipSlowest = (skipSlowest > us)?skipSlowest:us;
    linFastest = (linFastest < t1)?linFastest:t1;
    linSlowest = (linSlowest > t1)?linSlowest:t1;
}
stdio.writeOver(`Average skip search: ${setPrecision(avg/100, 4)}us`.padEnd(28, ' '));
stdio.writeAppend(' | ');
stdio.writeAppend(`Average linear search: ${setPrecision(avg1/100,4)}ms`);
stdio.writeLine(`Fastest skip search: ${setPrecision(skipFastest,4)}us`.padEnd(28, ' '));
stdio.writeAppend(' | ');
stdio.writeAppend(`Fastest linear search: ${setPrecision(linFastest,4)}ms`);
stdio.writeLine(`Slowest skip search: ${setPrecision(skipSlowest,4)}us`.padEnd(28,' '));
stdio.writeAppend(' | ');
stdio.writeAppend(`Slowest linear search: ${setPrecision(linSlowest,4)}ms`);

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
            case 'find':
            n = list.find(node => node.compare(d => d - input[1]));
            if(n) stdio.writeLine(`Found ${n.toString()}`);
            else stdio.writeLine(`Not found`);
            break;
            case 'insert':
            n = list.insert(input[1], node => node.compare(d => d - input[1]));
            if(n === 0) stdio.writeLine(`Added`);
            else stdio.writeLine(`Duplicate, not added`);
            break;
            case 'remove':
            n = list.remove(node => node.compare(d => d - input[1]));
            if(n === 0) stdio.writeLine(`Removed ${input[1]}`);
            else stdio.writeLine(`Not found`);
            break;
            case 'destroy':
            list.destroy();
            break;
            case 'exit': process.exit(0); break;
        }
    }
});
