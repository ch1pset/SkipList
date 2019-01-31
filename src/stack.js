
//A basic implementation of a stack using JS built-in array
//
//The main purpose was include a clear() method that would empty the stack and
//return a copy of the stack
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
