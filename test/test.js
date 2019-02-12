
const {Timer, Rand, SkipList, Node, stdio} = require('./header.js');

var list = new SkipList(9,4);
var timer = new Timer();
var timer1 = new Timer();
var console = new stdio();
var xorShift = Rand;

var length = 1000000;
var time_elapsed = 0;
var seconds = 0;
var count = added = dups = 0;

var setPrecision = (n, s) => Number.parseFloat(n).toPrecision(s);
timer.precision(0);

function updateStatus()
{
    console.writeOver(`Added: ${added}`.padEnd(15, ' '));
    console.writeAppend(`Dups(not added): ${dups}`.padEnd(25,' '));
    console.writeAppend(`Time Elapsed: ${setPrecision(time_elapsed,4)}s`.padEnd(23));
}

// console.writeLine(`Generating list`);
updateStatus();
timer.begin();
while(count != length)
{
    let x = xorShift() % (2 * length);
    let r = list.insert(x, (d1, d2) => d1 - d2);
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

console.onRead(() =>
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
    while((chunk = console.read()) !== null)
    {
        let n;
        let input = parse(chunk.toString());
        switch(input[0])
        {
            case 'find': case 'search':
            n = list.find(dat => dat - input[1]);
            if(n) console.writeLine(`Found ${n.toString()}`);
            else console.writeLine(`Not found`);
            break;
            case 'insert': case 'add':
            n = list.insert(input[1], (d1, d2) => d1 - d2);
            if(n === 0) console.writeLine(`Added`);
            else console.writeLine(`Duplicate, not added`);
            break;
            case 'remove': case 'delete':
            n = list.remove(dat => dat - input[1]);
            if(n === 0) console.writeLine(`Removed ${input[1]}`);
            else console.writeLine(`Not found`);
            break;
            case 'destroy': case 'clear':
            list.destroy();
            break;
            case 'exit': case 'quit': process.exit(0); break;
        }
    }
});
