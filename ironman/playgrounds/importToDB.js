/**
 * Created by wizard on 11/11/16.
 */

const mongodb = require('../libs/mongodb'),
    Promise = require('bluebird'),
    fs = require('fs'),
    WordExercise = require('../models/wordExercise'),
    logger = require('../libs/ironmanLogger');


function import_eight_a() {
    var words = JSON.parse(fs.readFileSync('./eight_grade_half_a.json', 'utf8'));

    logger.info(`count: ${words.length}`);

    words = words.map((word)=> {
        word.mail = 'eight.grade.half.a@gmail.com';
        return word;
    });

    var promises = words.map((word)=> {

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
        logger.info(`eight_grade_half_a succeed: ${results.length}`)
    });
}

function import_eight_b() {
    var words = JSON.parse(fs.readFileSync('./eight_grade_half_b.json', 'utf8'));

    logger.info(`count: ${words.length}`);

    words = words.map((word)=> {
        word.mail = 'eight.grade.half.b@gmail.com';
        return word;
    });

    var promises = words.map((word)=> {

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
        logger.info(`eight_grade_half_b succeed: ${results.length}`)
    });
}

//import_eight_a();
import_eight_b();
