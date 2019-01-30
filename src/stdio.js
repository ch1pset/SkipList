
function stdio()
{
    const output = process.stdout;
    const input = process.stdin;

    this.writeLine = (string) => output.write('\n' + string);
    this.writeOver = (string) => output.write('\r' + string);
    this.writeAppend = (string) => output.write(string);

    this.read = () => input.read();
    this.onRead = (callback) => input.on('readable', callback);
}

module.exports = stdio;
