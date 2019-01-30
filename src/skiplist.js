
var xorShift = require('./rand.js');
var Stack = require('./stack.js');

function Node(data)
{
    this.data = data;
    this.pointers = [null]; //[next, L1_next, L2_next, ..., Ln_next]

    this.getHeight = () => this.pointers.length;
    this.getNext = (level) => {
        if(this.pointers && level < this.pointers.length)
            return this.pointers[level];
        else return null;
    }
    this.setNext = (level, node) => this.pointers[level] = node;
    this.elevate = (max_height, probability) =>
    {
        let roll_die = () => xorShift() % probability; //define probability
        let h = 1;
        //Randomly decide to elevate node
        while(!roll_die() && h < max_height)
        {
            this.pointers.push(null);
            h++;
        }
        return h;
    }
    this.compare = (callback) => callback(this.data);
    this.destroy = () =>
    {
        delete this.data;
        for(let i in this.pointers)
        {
            delete this.pointers[i];
        }
        delete this.pointers;
    }
    this.toString = () =>
    {
        return `${data}`;
    }
}

//Skip list data structure
//max_height: detmerines the max level any node will reach
//probability: determines the probability that a node will be elevated to a higher level
//
//Self sorting
//No duplicate entries
//Quick searching
//
function SkipList(max_height, probability)
{
    //Private variables
    var HEAD = new Node(null);
    var HEIGHT = max_height?max_height:5;
    var PROB = probability?probability:2;
    var STACK = new Stack();

    //initialize HEAD container
    while(HEAD.pointers.length < HEIGHT) HEAD.pointers.push(null);

    // var SIZE = 0;
    //Private methods
    var addToList = (data) =>
    {
        let node = new Node(data);
        let h = node.elevate(HEIGHT, PROB);
        do
        {
            let last = STACK.pop();
            if(last[1] < h)
            {
                node.setNext(last[1], last[0].getNext(last[1]));
                last[0].setNext(last[1], node);
            }
        }
        while(STACK.length());
    }

    var delFromList = (node) =>
    {
        while(STACK.length())
        {
            let last = STACK.pop();
            let h = node.getHeight();
            if(last[1] < h)
            {
                last[0].setNext(last[1], node.getNext(last[1]));
            }
        }
        node.destroy();
    }

    //Public methods

    //Find(callback)
    //
    //callback is a function that should return one of three outcomes:
    //  result<0: continue traversal of list
    //  result>0: halt traversal of list and drop down a level if possible
    //  result==0: exact match found, halt traversal and return current object
    this.find = function(callback)
    {
        let cur = HEAD;
        let level = HEIGHT - 1;
        STACK.clear();
        while(cur)
        {
            STACK.push([cur,level]);
            let next = cur.getNext(level);
            if(next)
            {
                let test = callback(next);
                if(test === 0) //found match
                {
                    if(level !== 0) level--;
                    else return next;
                }
                else if(test < 0) //still further
                {
                    STACK.pop();
                    cur = next;
                }
                else if(test > 0) //overshot
                {
                    if(level !== 0) level--;
                    else return null;
                }
            }
            else if(level !== 0) level--; //pointing to null, drop or return null
            else return null;
        }
    }

    this.findLinear = function(callback)
    {
        let cur = HEAD;
        while(cur)
        {
            let test = callback(cur);
            if(test === 0)
            {
                return cur;
            }
            else if(test < 0)
            {
                cur = cur.getNext(0);
            }
            else if(test > 0)
            {
                return null;
            }
            else return null;
        }
    }

    //insert(data, callback)
    //
    //callback should be the same as in find() for consistent behavior
    //
    //data anything to be stored within the list
    this.insert = function(data, callback)
    {
        let next = this.find(callback);
        if(!next) //add if end of list or overshot point
        {
            addToList(data);
            return 0;
        }
        else return -1; //do not add duplicates(callback returns 0)
    }

    //remove(callback)
    //
    //callback same as find()
    //
    this.remove = function(callback)
    {
        let next = this.find(callback);
        if(next) //delete if exact match found
        {
            delFromList(next);
            return 0;
        }
        else return -1; //do not delete if no match found
    }

    this.toString = function()
    {
        let cur = HEAD;
        STACK.clear();
        while(cur)
        {
            STACK.push(cur.data);
            cur = cur.getNext(0);
        }
        return STACK.clear().join('\n');
    }

    this.destroy = function()
    {
        let cur = HEAD;
        while(cur)
        {
            prev = cur;
            cur = cur.getNext(0);
            prev.destroy();
        }
        HEAD.destroy();
        STACK.destroy();
    }
}

module.exports = SkipList;
