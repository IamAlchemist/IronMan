/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('../libs/mongodb');

export const WordExerciseProgressModel = mongodb.model('WordExerciseProgress', {
    mail: String,
    wordExercise: Object,
    progress: Number
});

function throwIfMissing() {
    throw new Error('Missing parameter');
}

export function MakeWordExerciseProgress (mail = throwIfMissing(), wordExercise= throwIfMissing(), progress = 0) {
    "use strict";
    return new WordExerciseProgressModel({mail, wordExercise, progress})
}

