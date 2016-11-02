/**
 * Created by wizard on 10/30/16.
 */

'use strict';

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

// type: 0 for 选择题; 1 for 填空题
const ExerciseSchema = new Schema({
    mail: String,
    title: String,
    description: String,
    answer: Number,
    options: [String],
    hints: [String],
    tags: [String],
    type: Number
});

ExerciseSchema.plugin(timestamps);

const ExerciseModel = mongodb.model('Exercise', ExerciseSchema);
module.exports.ExerciseModel = ExerciseModel;

module.exports.makeExercise = function (mail,
                                        title,
                                        description,
                                        answer,
                                        options,
                                        hints,
                                        tags,
                                        type = 0) {

    return new ExerciseModel({
        mail,
        title,
        description,
        answer,
        options,
        hints,
        tags,
        type
    });
};