/**
 * Created by wizard on 11/1/16.
 */

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

const WordExerciseProgressSchema = new Schema({
    mail: String,
    wordExercise: Object,
    progress: Number
});
WordExerciseProgressSchema.plugin(timestamps);

const WordExerciseProgressModel =
    mongodb.model('WordExerciseProgress', WordExerciseProgressSchema);
module.exports.WordExerciseProgressModel = WordExerciseProgressModel;

function throwIfMissing() {
    throw new Error('Missing parameter');
}

module.exports.MakeWordExerciseProgress =
    function MakeWordExerciseProgress(mail = throwIfMissing(),
                                      wordExercise = throwIfMissing(),
                                      progress = 0) {
        return new WordExerciseProgressModel({mail, wordExercise, progress});
    };

