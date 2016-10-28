var Q = require('q');
/**
 *@private
 */
function getPromise(msg,timeout,opt) {
    var defer = Q.defer();
    setTimeout(function(){
        console.log(msg);
        if(opt)
            defer.reject(msg);
        else
            defer.resolve(msg);
    },timeout);
    return defer.promise;
}
/**
 *没有用done()结束的promise链
 *由于getPromse('2',2000,'opt')返回rejected, getPromise('3',1000)就没有执行
 *然后这个异常并没有任何提醒，是一个潜在的bug
 */
// getPromise('1',3000)
//     .then(function(){return getPromise('2',2000,'opt')})
//     .then(function(){return getPromise('3',1000)});
/**
 *用done()结束的promise链
 *有异常抛出
 */
getPromise('1',3000)
    .then(function(){return getPromise('2',2000,'opt')})
    .then(function(){return getPromise('3',1000)})
    .done();