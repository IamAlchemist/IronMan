/**
 * Created by wizard on 11/14/16.
 */
const mongodb = require('../libs/mongodb'),
    Promise = require('bluebird').Promise,
    wordExerciseLib = require('../libs/wordsExercisesLib'),
    wordExerciseProgress = require('../models/wordExerciseProgress'),
    wordExerciseSource = require('../models/wordExerciseSource'),
    logger = require('../libs/ironmanLogger');

const mail = "2892764440@qq.com";
const mails = ["nine.grade.half.a@gmail.com", "eight.grade.half.b@gmail.com"];

// let result = [];
// Promise.each(mails, function (source) {
//     return wordExerciseProgress.WordExerciseProgressModel.find({mail, "wordExercise.mail":source}).limit(10).exec()
//         .then(array => {
//             result = result.concat(array);
//             console.log(result.length);
//             return Promise.resolve(result);
//         })
// }).then((datas)=>{
//     console.log(datas.length);
// });

// const mail = "1427609882@qq.com";
// wordExerciseLib.importWords(mail, "nine.grade.half.a@gmail.com")
//     .then((progresses)=>{
//         logger.info(`import : ${progresses.length}`);
//     });

wordExerciseLib.wordExercisesForToday("1427609882@qq.com")
    .then(progresses => {
        console.log(progresses.length);
        const datas = progresses.map(progress => {
            let result = {};
            result.mail = progress.wordExercise.mail;
            result.word = progress.wordExercise.word;
            result.progress = progress.progress;
            console.log(JSON.stringify(result));
            return result
        });

        //console.log(JSON.stringify(datas, null, 2));
    });
