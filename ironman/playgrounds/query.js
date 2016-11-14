/**
 * Created by wizard on 11/14/16.
 */
const mongodb = require('../libs/mongodb'),
    wordExerciseLib = require('../libs/wordsExercisesLib'),
    wordExerciseProgress = require('../models/wordExerciseProgress'),
    wordExerciseSource = require('../models/wordExerciseSource'),
    logger = require('../libs/ironmanLogger');

const mail = "1427609882@qq.com";
wordExerciseProgress.WordExerciseProgressModel
    .find({mail})
    .exec()

    .then((progresses)=> {
        const allOwners = progresses.map(p => p.wordExercise.mail);
        const uniqueOwners = Array.from(new Set(allOwners));
        logger.info(JSON.stringify(uniqueOwners, null, 2));
        return new Promise(function (resolve) {
            return resolve(uniqueOwners);
        });
    })

    .then((uniqueOwners)=> {
        return wordExerciseSource.updateWordOwnersOf(mail, uniqueOwners);
    })

    .catch((e)=> {
        logger.error(e.message);
    });
