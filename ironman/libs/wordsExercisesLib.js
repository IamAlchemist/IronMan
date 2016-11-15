/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('./mongodb'),
    Promise = require('bluebird').Promise,
    WordExerciseProgress = require('../models/wordExerciseProgress'),
    WordExercise = require('../models/wordExercise'),
    wordSource = require('../models/wordExerciseSource'),
    User = require('../models/user'),
    moment = require('moment'),
    wordExerciseSource = require('../models/wordExerciseSource'),
    logger = require('../libs/ironmanLogger');

const maxProgress = 15;
const totalWordMaxToday = 40;
const singleSourceWordMaxToday = 20;

module.exports.updateStudentWordsBank = function (mail) {
    let cacheWordMails = [];

    return User.UserModel.findOne({mail}).exec()

        .then((user)=> {
            if (!user.isStudent) {
                logger.error('user should be a student!');
                throw Error('should be student account');
            }

            let allWordSources = [];

            if (user.linkedUserMails != undefined && user.linkedUserMails.length != 0) {
                allWordSources = user.linkedUserMails.slice(0);
            }

            allWordSources.push(user.mail);

            return Promise.resolve(allWordSources);
        })

        .then((wordSources)=> {

            if (wordSources.length == 0) {
                throw Error('no related account');
            }

            logger.info(`find words from mails, mails count: ${wordSources.length}`);

            cacheWordMails = wordSources;

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
            wordExerciseSource.updateWordOwnersOf(mail, cacheWordMails);
            return new Promise.all(wordExercises.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })

        .catch((error)=> {
            logger.error(`error : ${error.message}`);
            throw error;
        });
};

module.exports.wordExercisesForToday = function (mail) {
    let leftedCount = totalWordMaxToday;
    let accumulator = [];

    return wordSource.wordOwnersOf(mail)

        .then(sources => {
            return Promise.each(sources, function (source) {
                logger.error(leftedCount);
                const maxWordsCount = Math.min(leftedCount, singleSourceWordMaxToday);
                return wordsPickedIn(mail, source, maxWordsCount)
            });
        })
        .then(()=>{
            return Promise.resolve(accumulator);
        });

    function wordsPickedIn(mail, source, maxWordsCount) {
        let progress_zero_count = Math.floor(maxWordsCount / 2);

        return WordExerciseProgress.WordExerciseProgressModel
            .find({mail, "wordExercise.mail":source})
            .where('progress').equals(0)
            .sort('updatedAt')
            .limit(progress_zero_count)
            .exec()

            .then((progresses)=> {
                logger.info(`${mail},${accumulator.length}`);
                accumulator = accumulator.concat(progresses);
                leftedCount -= accumulator.length;
                logger.info(`${mail}, progress 0 count: ${progresses.length}, ${accumulator.length}`);

                const progress_non_zero_count = Math.min(leftedCount, singleSourceWordMaxToday);

                return WordExerciseProgress.WordExerciseProgressModel
                    .find({mail, "wordExercise.mail": source})
                    .where('progress').gt(0).lte(maxProgress)
                    .sort('progress')
                    .limit(progress_non_zero_count)
                    .exec()
            })

            .then((progresses2)=> {
                accumulator = accumulator.concat(progresses2);
                logger.info(`progress non-zero count: ${progresses2.length}, ${accumulator.length}`);
                return Promise.resolve(accumulator);
            })

            .catch((error)=> {
                logger.error(error.message);
                throw error;
            })
    }
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
        .where('progress').gt(0)
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
        .where('progress').gt(0)
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
            wordExerciseSource.updateWordOwnersOf(mail, [gradeMail]);
            return new Promise.all(wordExercises.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

