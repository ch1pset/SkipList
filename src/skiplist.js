
var xorShift = require('./rand.js');
var Stack = require('./stack.js');

function Node(data)
{
    this.data = data;
    this.next = []; //[L1_next, L2_next, ..., Ln_next]
    this.prev = []; //[L1_prev, L2_prev, ..., Ln_prev]
    this.height = 1;

    this.elevate = (max_height, probability) =>
    {
        let roll_die = () => xorShift() % probability; //define probability
        //Randomly decide to elevate node
        while(!roll_die() && this.height < max_height)
        {
            this.next.push(null);
            this.prev.push(null);
            this.height++;
        }
        return this.height;
    }
    this.compare = (callback) => callback(this.data);
    this.destroy = () =>
    {
        delete this.data;
        for(let i = 0; i < this.height)
        {
            delete this.next[i];
            delete this.prev[i];
        }
        delete this.next;
        delete this.prev;
        delete this.height;
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
    var TAIL = new Node(null);
    var HEIGHT = max_height?max_height:5;
    var PROB = probability?probability:2;
    var STACK = new Stack();

    //initialize HEAD and TAIL
    for(let h = 0; h <= HEIGHT; h++)
    {
        HEAD.next.push(TAIL);
        TAIL.prev.push(HEAD);
    }

    //Public methods

    //Find(callback)
    //
    //callback is a function that should return one of three outcomes:
    //  result<0: continue traversal of list
    //  result>0: halt traversal of list and drop down a level if possible
    //  result==0: exact match found, halt traversal and return current object
    this.findR = function(compare, current, level)
    {
        if(!current)
        {
            return this.findR(compare, HEAD.next[HEIGHT - 1], HEIGHT - 1);
        }
        else if(current != TAIL)
        {
            let result = compare(current.data);
            if(result === 0) return current;
            if(result < 0) return this.findR(compare, current.next[level], level);
            if(result > 0) return level? this.findR(compare, current.next[--level], --level) : null;
        }
        else return level? this.findR(compare, current.next[--level], --level) : null;
    }

    this.add = function(data, compare)
    {
        let node = new Node(data);

        let level = HEIGHT - 1;
        let cur = HEAD;

        let setPtrs = (n,p) =>
        {
            node.setPrev(p, level);
            node.setNext(n, level);
            p.setNext(node, level);
            n.setPrev(node, level);
        }
    }

    this.forEach = function(callback)
    {
        let cur = HEAD;
        let next = cur.next[0];
        while(next != TAIL)
        {
            callback(next);
            cur = next;
            next = cur.next[0];
        }
    }

    // this.clear = function()
    // {
    //     let cur = HEAD;
    //     while(cur)
    //     {
    //         this.remove(node => true);
    //     }
    // }

    this.toArray = function()
    {
        let cur = HEAD;
        let next = cur.next[0];
        let out = [];
        while(next != TAIL)
        {
            out.push(next.data);
            cur = next;
            next = cur.next[0];
        }
        return out;
    }

    this.toString = function()
    {
        let cur = HEAD.next[0];
        STACK.clear();
        while(cur != TAIL)
        {
            STACK.push(cur.data);
            cur = cur.next[0];
        }
        return STACK.clear().join('\n');
    }

    this.destroy = function()
    {
        let cur = HEAD;
        while(cur != TAIL)
        {
            prev = cur;
            cur = cur.next[0];
            prev.destroy();
        }
        HEAD.destroy();
        STACK.destroy();
    }
}

module.exports = {SkipList,Node};
