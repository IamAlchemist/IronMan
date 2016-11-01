/**
 * Created by wizard on 11/1/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');

export const WordExerciseModel = mongodb.model('WordExercise', {
    mail: String,
    word: String,
    partOfSpeech: String,
    explanation: String,
    example: String,
    exampleExplanation: String,
    others: String
});

export function MakeWordExercise(mail = throwIfMissing(),
                                 word = throwIfMissing(),
                                 partOfSpeech = throwIfMissing(),
                                 explanation = throwIfMissing(),
                                 example = throwIfMissing(),
                                 exampleExplanation = throwIfMissing(),
                                 others = '')
{
    return new WordExerciseModel({
        mail,
        word,
        partOfSpeech,
        explanation,
        example,
        exampleExplanation,
        others});
}

function throwIfMissing() {
    throw new Error('Missing parameter');
}


