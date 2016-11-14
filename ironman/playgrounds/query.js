/**
 * Created by wizard on 11/14/16.
 */
const mongodb = require('../libs/mongodb'),
    wordExerciseLib = require('../libs/wordsExercisesLib'),
    logger = require('../libs/ironmanLogger');

wordExerciseLib.wordExercisesForToday("1427609882@qq.com")
    .then((progresses)=>{
        for (let p of progresses) {
            logger.info(`word: ${p.wordExercise.word}, progress: ${p.progress}`);
        }
    });