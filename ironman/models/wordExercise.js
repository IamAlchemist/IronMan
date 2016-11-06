/**
 * Created by wizard on 11/1/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

const WordExerciseSchema = new Schema({
    mail: String,
    word: String,
    partOfSpeech: String,
    explanation: String,
    example: String,
    exampleExplanation: String,
    others: String
});
WordExerciseSchema.plugin(timestamps);

const WordExerciseModel = mongodb.model('WordExercise', WordExerciseSchema);
module.exports.WordExerciseModel = WordExerciseModel;

module.exports.MakeWordExercise =
    function MakeWordExercise(mail = throwIfMissing(),
                              word = throwIfMissing(),
                              partOfSpeech = throwIfMissing(),
                              explanation = throwIfMissing(),
                              example = throwIfMissing(),
                              exampleExplanation = throwIfMissing(),
                              others = '') {
        return new WordExerciseModel({
            mail,
            word,
            partOfSpeech,
            explanation,
            example,
            exampleExplanation,
            others
        });
    };

function throwIfMissing() {
    throw new Error('Missing parameter');
}

