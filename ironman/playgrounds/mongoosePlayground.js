'use strict';
const logger = require('./../libs/ironmanLogger');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird.Promise;
const mongodb = mongoose.connect('mongodb://localhost/test');

const WordModel = mongodb.model('Word', {
    word: String
});

const WordProgressModel = mongodb.model('WordProgress', {
    progress: Number,
    word: Object
});

class Word {
    constructor(word) {
        Object.assign(this, {word});
    }

    save() {
        return WordProgressModel(this).save();
    }
}

function insertAWordProgress() {
    WordModel.findOne({}).exec()
        .then((word)=>{
            const progress = new WordProgressModel({
                progress: 0,
                word
            });

            logger.info(JSON.stringify(progress));

            progress.save()
                .then((progress)=>{
                    logger.info(JSON.stringify(progress));
                });
        })
}

function insertAWord() {
    const wordString = 'hello2';

    const word = new Word(wordString);
    word.save()
        .then((sth)=> {
            logger.info(JSON.stringify(sth));
        })
        .catch((err)=> {
            logger.info(JSON.stringify(err));
        });
}

function showWord() {
    WordProgressModel.findOne({progress: 0})
        .then((progress)=>{
            logger.warn(progress.word.word);
        });
}

function showChain() {
    WordProgressModel.findOne({progress: 0}).exec()
        .then((progress)=>{
            console.log(progress.progress);
            return WordModel.findOne({word: progress.word.word}).exec()
        })
        .then((word)=>{
            console.log(word.word)
        })
}

//insertAWord();
//insertAWordProgress();
//showWord();
//showChain();


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