/**
 * Created by wizard on 11/2/16.
 */

var m = [[1], [2,3], [4], [5,6]];
var n = [].concat(...m);

console.log(JSON.stringify(n));

const progress1 = {_id: "this"};

var map = new Map();

map.set(progress1._id, progress1);

console.log(""+map.has("this"));


