/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('./mongodb'),
    Promise = require('bluebird').Promise,
    WordExerciseProgress = require('../models/wordExerciseProgress'),
    WordExercise = require('../models/wordExercise'),
    User = require('../models/user'),
    moment = require('moment'),
    logger = require('../libs/ironmanLogger');

const maxProgress = 15;

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

        .then((progresses)=> {

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

        .then((wordExercises)=> {
            logger.info(`wordExercises size : ${wordExercises.length}`);
            return new Promise.all(wordExercises.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })

        .catch((error)=> {
            logger.error(`error : ${error.message}`);
            throw error;
        });
};

module.exports.wordExercisesForToday = function (mail) {
    let result = [];

    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .where('progress').equals(0)
        .sort('updatedAt')
        .limit(10)
        .exec()

        .then((progresses)=> {
            logger.info(`progress 0 count: ${progresses.length}`);
            result = progresses.slice(0);
            const leftedLimit = 20 - progresses.length;

            return WordExerciseProgress.WordExerciseProgressModel
                .find({mail})
                .where('progress').gt(0).lte(maxProgress)
                .sort('updatedAt')
                .limit(leftedLimit)
                .exec()
        })

        .then((progresses2)=> {
            logger.info(`progress non-zero count: ${progresses2.length}`);
            result = result.concat(progresses2.slice(0));

            return new Promise(function (resolve) {
                resolve(result);
            })
        })

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        })

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

module.exports.achievementToday = function (mail) {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .where('updatedAt').gte(startOfDay.toDate()).lte(endOfDay.toDate())
        .exec()
        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

module.exports.inspectAchievementToday = function (user) {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    return WordExerciseProgress.WordExerciseProgressModel
        .find({})
        .where('mail').in(user.linkedUserMails)
        .where('updatedAt').gte(startOfDay.toDate()).lte(endOfDay.toDate())
        .exec()

        .then((progresses)=> {
            let result = [];
            for (let m of user.linkedUserMails) {
                let mp = progresses.filter(p => p.mail == m);
                if (mp.length != 0) {
                    result.push({mail: m, progresses: mp})
                }
            }

            return new Promise((resolve)=> {
                resolve(result);
            });
        })

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });

};

module.exports.importWords = function (mail, gradeMail) {
    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .where('wordExercise.mail').equals(gradeMail)

        .exec()

        .then((progresses)=> {
            if (progresses.length != 0) {
                return new Promise(function (resolve) {
                    resolve([]);
                });
            }
            else {
                return WordExercise.WordExerciseModel
                    .find({mail: gradeMail})
                    .exec()
            }
        })

        .then((wordExercises) => {
            logger.info(`will add wordExercises : ${wordExercises.length}`);
            return new Promise.all(wordExercises.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

