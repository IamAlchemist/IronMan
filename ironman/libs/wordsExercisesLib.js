/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('./mongodb');
const Promise = require('bluebird').Promise;
const WordExerciseProgress = require('../models/wordExerciseProgress');
const WordExercise = require('../models/wordExercise');
const logger = require('../libs/ironmanLogger');

module.exports.updateWordsBank = function updateWordsBank(mail) {
    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .sort('-_id')
        .exec()
        .then((progresses)=> {
            logger.info(`progresses size : ${progresses.length}`);
            if (progresses.length == 0) {
                return WordExercise.WordExerciseModel.find({}).exec();
            }
            else {
                const progress = progresses[0];
                return WordExercise.WordExerciseModel.find({mail})
                    .where('_id').gt(progress.wordExercise._id)
                    .exec();

            }
        })
        .then((words)=> {
            logger.info(`words size : ${words.length}`);
            return Promise.all(words.map((word)=> WordExerciseProgress.MakeWordExerciseProgress(mail, word).save()));
        })
        .catch((error)=> {
            throw error;
        });
};

module.exports.wordExercisesForToday = function (mail) {
    return WordExerciseProgress.WordExerciseProgressModel
        .find({mail})
        .exec();
};

module.exports.updateWordExerciseProgresses = function (progresses) {
    let map = new Map();
    for (let prog in progresses) {
        map.set(prog._id, prog);
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
            return progresses2.map((p)=> {
                p.progress = map.get(p._id).progress;
                return p.save();
            })
        });
};

