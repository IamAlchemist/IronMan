/**
 * Created by wizard on 11/11/16.
 */

const mongodb = require('../libs/mongodb'),
    Promise = require('bluebird'),
    fs = require('fs'),
    WordExercise = require('../models/wordExercise'),
    logger = require('../libs/ironmanLogger');


var words = JSON.parse(fs.readFileSync('./nine_grade_half_a.json', 'utf8'));

logger.info(`count: ${words.length}`);

words = words.map((word)=> {
    word.mail = 'nine.grade.half.a@gmail.com';
    return word;
});

var promises = words.map((word)=> {
//    logger.info(JSON.stringify(word, null, 2));

    return WordExercise.MakeWordExercise(
        word.mail,
        word.word,
        word.partOfSpeech,
        word.explanation,
        word.example,
        word.exampleExplanation,
        word.pronunciation,
        word.others
    ).save();

});

const final = new Promise.all(promises);

final.then((results)=> {
    logger.info(`succeed: ${results.length}`)
});