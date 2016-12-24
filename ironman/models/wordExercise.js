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
    pronunciation:String,
    others: String
});
WordExerciseSchema.plugin(timestamps);

const WordExerciseModel = mongodb.model('WordExercise', WordExerciseSchema);
module.exports.WordExerciseModel = WordExerciseModel;
function MakeWordExercise(mail = throwIfMissing(),
                          word = throwIfMissing(),
                          partOfSpeech = throwIfMissing(),
                          explanation = throwIfMissing(),
                          example = throwIfMissing(),
                          exampleExplanation = throwIfMissing(),
                          pronunciation,
                          others = '') {
    return new WordExerciseModel({
        mail,
        word,
        partOfSpeech,
        explanation,
        example,
        exampleExplanation,
        pronunciation,
        others
    });
}
module.exports.MakeWordExercise = MakeWordExercise;

function throwIfMissing() {
    throw new Error('Missing parameter');
}

