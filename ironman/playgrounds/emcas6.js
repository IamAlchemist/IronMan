/**
 * Created by wizard on 11/2/16.
 */
const moment = require('moment');
const Promise = require('bluebird').Promise;
const fs = require('fs');
var writeFileAsync = Promise.promisify(fs.writeFile);

// var files = [];
// for (var i = 0; i < 100; ++i) {
//     files.push(writeFileAsync("file-" + i + ".txt", "", "utf-8"));
// }
//
// Promise.all(files).then(function(datas) {
//     for(let data in datas) {
//         console.log(JSON.stringify(data));
//     }
//     console.log("all the files were created");
// });
