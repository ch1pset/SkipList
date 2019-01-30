
function Stack()
{
    var array = [];
    this.push = (item) => array.push(item);
    this.pop = () => array.pop();
    this.clear = () =>
    {
        let out = array;
        for(let i in array)
        {
            delete array[i];
        }
        array = [];
        return out;
    }
    this.length = () => array.length;
    this.destroy = () =>
    {
        for(let i in array)
        {
            delete array[i];
        }
        delete array;
    }
}

module.exports = Stack;
