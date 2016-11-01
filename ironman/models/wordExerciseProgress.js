/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('../libs/mongodb');

const WordExerciseProgressModel = mongodb.model('WordExerciseProgress', {
    mail: String,
    wordExercise: Object,
    progress: Number
});

module.exports.WordExerciseProgressModel = WordExerciseProgressModel;

function throwIfMissing() {
    throw new Error('Missing parameter');
}

module.exports.MakeWordExerciseProgress = function MakeWordExerciseProgress (mail = throwIfMissing(),
                                          wordExercise= throwIfMissing(),
                                          progress = 0) {
    return new WordExerciseProgressModel({mail, wordExercise, progress})
};

