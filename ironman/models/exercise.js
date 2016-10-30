/**
 * Created by wizard on 10/30/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');

const ExerciseModel = mongodb.model('Exercise', {
    username: String,
    title: String,
    description: String,
    answer: Number,
    options: [String],
    hints: [String],
    tags: [String]
});

function Exercise(exercise) {
    this.username = exercise.username;
    this.title = exercise.title;
    this.description = exercise.description;
    this.answer = exercise.answer;
    this.options = exercise.options;
    this.tags = exercise.tags;
}

Exercise.prototype.save = function () {

};
