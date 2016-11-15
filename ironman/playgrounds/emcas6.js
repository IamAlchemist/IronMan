/**
 * Created by wizard on 11/2/16.
 */
const moment = require('moment');
const Promise = require('bluebird').Promise;
const fs = require('fs');
var writeFileAsync = Promise.promisify(fs.writeFile);

var num = 9;

function chainP(p, index) {
    if (index < 0) {
        const result = p.then(array => new Promise.resolve(array));
        return result;
    }

    p.then((array)=>{
        console.log(`${index}`);
        array = array.push(index);
        return new Promise.resolve(array);
    });

    return chainP(p, index-1);
}

const p = new Promise.resolve([]);

chainP(p, 9)
    .then((array)=>{
        console.log(array.length);
    });

