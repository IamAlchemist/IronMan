/**
 * Created by wizard on 11/1/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');

const WordExerciseModel = mongodb.model('WordExercise', {
    mail: String,
    word: String,
    partOfSpeech: String,
    explanation: String,
    example: String,
    exampleExplanation: String,
    others: String
});

function WordExercise(wordExercise) {
    this.mail = wordExercise.mail;
    this.word = wordExercise.word;
    this.partOfSpeech = wordExercise.partOfSpeech;
    this.explanation = wordExercise.explanation;
    this.example = wordExercise.example;
    this.exampleExplanation = wordExercise.exampleExplanation;
    this.others = wordExercise.others;
}

WordExercise.prototype.save = function () {
    return WordExerciseModel(this).save();
};

WordExercise.getByType = function (type, mail) {
    return WordExerciseModel.find( {type, mail} ).exec();
};

module.exports = WordExercise;
