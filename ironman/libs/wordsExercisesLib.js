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

const maxProgress = 24;
const totalWordMaxToday = 50;
let singleSourceWordMaxToday = 25;

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

    return wordSource.wordSourcesOf(mail)

        .then(sources => {
            return Promise.each(sources, function (source) {
                singleSourceWordMaxToday = Math.floor(totalWordMaxToday / sources.length) + 1;
                const maxWordsCount = Math.min(leftedCount, singleSourceWordMaxToday);
                return wordsPickedIn(mail, source, maxWordsCount)
            });
        })
        .then(()=> {
            return Promise.resolve(accumulator);
        });

    function wordsPickedIn(mail, source, maxWordsCount) {
        const progress_zero_count = Math.max(Math.floor(maxWordsCount / 2), 1);

        return WordExerciseProgress.WordExerciseProgressModel
            .find({mail, "wordExercise.mail": source})
            .where('progress').equals(0)
            .sort('updatedAt')
            .limit(progress_zero_count)
            .exec()

            .then((progresses)=> {
                logger.info(`pick from ${source}, for ${mail}`);
                accumulator = accumulator.concat(progresses);
                logger.info(`${progresses.length} p-0 are picked.`);
                leftedCount = totalWordMaxToday - accumulator.length;

                const progress_non_zero_count = Math.max(Math.min(leftedCount, singleSourceWordMaxToday), 1);

                return WordExerciseProgress.WordExerciseProgressModel
                    .find({mail, "wordExercise.mail": source})
                    .where('progress').gt(0).lt(maxProgress)
                    .sort('progress')
                    .limit(progress_non_zero_count)
                    .exec()
            })

            .then((progresses2)=> {
                accumulator = accumulator.concat(progresses2);
                leftedCount = totalWordMaxToday - accumulator.length;
                logger.info(`${progresses2.length} p-non-0 are picked.`);
                return Promise.resolve(accumulator);
            })

            .catch((error)=> {
                logger.error(error.message);
                throw error;
            })
    }
};

module.exports.updateWordExerciseProgresses = function (progresses, isForced) {
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
    return WordExercise.WordExerciseModel
        .find({mail: gradeMail})
        .exec()
        .then((wordExercises) => {
            logger.info(`will add wordExercises : ${wordExercises.length}`);
            wordExerciseSource.updateWordOwnersOf(mail, [gradeMail]);

            return Promise.each(wordExercises, (wordExercise) => {
                return WordExerciseProgress.WordExerciseProgressModel
                    .find({'wordExercise.word': wordExercise.word})
                    .exec()
                    .then((progresses)=> {
                        if (progresses.length != 0) {
                            return Promise.resolve();
                        }
                        else {
                            return WordExerciseProgress.MakeWordExerciseProgress(mail, wordExercise).save();
                        }
                    });
            });
        })

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

function statisticsDataForMail(mail) {
    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .exec()
        .then((wordProgresses)=> {
            let result = new Map();
            for (let progress of wordProgresses) {
                let key = `${Math.round(progress.progress / 3)}`;
                if (!result.has(key)) {
                    result.set(key, 1);
                }
                else {
                    result.set(key, result.get(key) + 1);
                }
            }

            let total = 0;
            for (let count of result.values()) {
                total += count;
            }

            let data = Array();

            for (let [key, value] of result.entries()) {
                let item = {};
                item.name = `记忆次数 ${key}`;
                item.y = value;
                data.push(item);
            }

            let item = {
                mail,
                data
            };
            return Promise.resolve(item);
        });
}
module.exports.statisticsDataForMail = statisticsDataForMail;

module.exports.statisticsDataForUser = function (user) {
    if (user.isStudent) {
        return statisticsDataForMail(user.mail)
            .then((data)=> {
                return Promise.resolve([data]);
            })
    }
    else {
        const promises = user.linkedUserMails.map((mail)=> {
            return statisticsDataForMail(mail);
        });

        return Promise.all(promises);
    }
};

