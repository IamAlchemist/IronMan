/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('./mongodb');
const Promise = require('bluebird').Promise;
const WordExerciseProgress = require('../models/wordExerciseProgress');
const WordExercise = require('../models/wordExercise');
const User = require('../models/user');
const logger = require('../libs/ironmanLogger');

module.exports.updateStudentWordsBank = function (mail) {
    let cacheWordMails = [];

    return User.UserModel.findOne({mail}).exec()

        .then((user)=> {
            if (!user.isStudent) {
                throw Error('should be student account');
            }
            logger.info('user is a student');

            let allUserMails = [];

            if (user.linkedUserMails != undefined && user.linkedUserMails.length != 0) {
                allUserMails = user.linkedUserMails.slice(0);
            }

            allUserMails.push(user.mail);

            return new Promise(function (resolve) {
                resolve(allUserMails);
            });
        })

        .then((wordMails)=> {

            if (wordMails.length == 0) {
                throw Error('no related account');
            }

            logger.info(`find words from mails, mails count: ${wordMails.length}`);

            cacheWordMails = wordMails;

            return WordExerciseProgress.WordExerciseProgressModel
                .find({mail})
                .sort('-_id')
                .exec()
        })

        .then((progresses)=>{

            logger.info(`find progresses size : ${progresses.length}`);
            if (progresses.length == 0) {
                return WordExercise.WordExerciseModel.find({mail: {$in: cacheWordMails}})
                    .exec();
            }
            else {
                const progress = progresses[0];
                return WordExercise.WordExerciseModel.find({mail: {$in: cacheWordMails}})
                    .where('_id').gt(progress.wordExercise._id)
                    .exec();
            }
        })

        .then((wordExercises)=>{
            logger.info(`wordExercises size : ${wordExercises.length}`);
            return new Promise.all(wordExercises.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })

        .catch((error)=>{
            logger.error(`error : ${error.message}`);
            throw error;
        });
};

module.exports.wordExercisesForToday = function (mail) {
    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .exec();
};

module.exports.updateWordExerciseProgresses = function (progresses) {
    var myMap = new Map();
    for (let prog of progresses) {
        myMap.set(`${prog._id}`, prog.progress);
    }

    let progressIds = progresses.map(progress => mongodb.Types.ObjectId(progress._id));

    return WordExerciseProgress.WordExerciseProgressModel
        .find({
            '_id': {
                $in: progressIds
            }
        })
        .exec()

        .then((progresses2) => {
            logger.info(`find ids : ${progresses2.length}`);

            return progresses2.map((p)=> {
                let pid = `${p._id}`;
                let value = myMap.get(pid);
                p.progress = value == undefined ? p.progress : value;

                return p.save();
            })
        });
};

