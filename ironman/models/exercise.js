/**
 * Created by wizard on 10/30/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');

// type: 0 for 选择题; 1 for 填空题
const ExerciseModel = mongodb.model('Exercise', {
    mail: String,
    title: String,
    description: String,
    answer: Number,
    options: [String],
    hints: [String],
    tags: [String],
    type: Number
});

function Exercise(exercise) {
    this.mail = exercise.mail;
    this.title = exercise.title;
    this.description = exercise.description;
    this.answer = exercise.answer;
    this.options = exercise.options;
    this.hints = exercise.hints;
    this.tags = exercise.tags;
    this.type = exercise.type;
}

Exercise.prototype.save = function () {
    return ExerciseModel(this).save();
};

Exercise.getByType = function (type, mail) {
    return ExerciseModel.find( {type, mail} ).exec();
};

module.exports = Exercise;