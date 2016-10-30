'use strict';

var strings = [" sf ", " mm "];
strings = strings.map( (str) => { return str.trim() } );

for (let str of strings) {
    console.log(str)
}
// const bluebird = require('bluebird');
// const mongoose = require('mongoose');
// mongoose.Promise = bluebird.Promise;
// const mongodb = mongoose.connect('mongodb://localhost/test');
//
// const NothingModel = mongoose.model('nothing', {
//     mail: String,
//     password: String
// });
//
// function Nothing(user) {
//     this.mail = user.mail;
//     this.password = user.password;
// }
//
// Nothing.prototype.save = function () {
//     return NothingModel(this).save();
// };
//
// Nothing.getByMail = function (mail) {
//     return NothingModel.findOne({mail: mail}).exec();
// };
//
// const nothing = new Nothing({mail: "mail", password: "passwd"});
//
// nothing.save()
//     .then((sth)=>{
//         console.log("1."+JSON.stringify(sth));
//         throw {err:"err"};
//     })
//     .catch((sth)=>{
//         console.log("2."+JSON.stringify(sth));
//     });
//
//

// var Q = require('q');
// /**
//  *@private
//  */
// function getPromise(msg,timeout,opt) {
//     var defer = Q.defer();
//     setTimeout(function(){
//         console.log(msg);
//         if(opt)
//             defer.reject(msg);
//         else
//             defer.resolve(msg);
//     },timeout);
//     return defer.promise;
// }
// /**
//  *没有用done()结束的promise链
//  *由于getPromse('2',2000,'opt')返回rejected, getPromise('3',1000)就没有执行
//  *然后这个异常并没有任何提醒，是一个潜在的bug
//  */
// // getPromise('1',3000)
// //     .then(function(){return getPromise('2',2000,'opt')})
// //     .then(function(){return getPromise('3',1000)});
// /**
//  *用done()结束的promise链
//  *有异常抛出
//  */
// getPromise('1',3000)
//     .then(function(){return getPromise('2',2000,'opt')})
//     .then(function(){return getPromise('3',1000)})
//     .done();