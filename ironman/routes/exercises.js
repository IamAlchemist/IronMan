/**
 * Created by wizard on 10/23/16.
 */
'use strict';

const express = require('express');
const Result = require('../libs/api-result');
const logger = require('../libs/ironmanLogger');
const Exercise = require('../models/exercise');
const WordExercise = require('../models/wordExercise');
const wordsExercisesLib = require('../libs/wordsExercisesLib');
const router = express.Router();

router.get('/', function (req, res) {
    Exercise.ExerciseModel.find({type: 0}).exec()
        .then((exercises)=> {
            logger.info(JSON.stringify(exercises));
            res.render('exercises/home', {exercises});
        })
        .catch((error)=> {
            logger.error(JSON.stringify(error));
            res.render('exercises/home');
        });
});

router.get('/create', function (req, res) {
    var params = {};
    res.render('exercises/create', params)
});

router.get('/words/create', function (req, res) {
    res.render('exercises/words/create');
});

router.get('/words', function (req, res) {
    res.render('exercises/words/home');
});

router.get('/words/memorizing', function (req, res) {
    res.render('exercises/words/memorizing');
});


/* API */
router.get('/words/wordExercisesForToday', (req, res)=> {
    const user = req.session.user;
    wordsExercisesLib.wordExercisesForToday(user.mail)
        .then((wordProcesses)=> {
            const result = new Result(0, wordProcesses);
            return res.send(result);
        })
        .catch((error)=> {
            logger.error(`get wordExercises for today failed: ${logger.str(error)}`);
            return res.send(new Result(104));
        });
});

router.get('/words/bank/update', function (req, res) {
    const user = req.session.user;
    wordsExercisesLib.updateStudentWordsBank(user.mail)
        .then((progresses)=> {
            logger.info(`update succeed : ${progresses.length}`);
            return res.send(new Result(0, {count: progresses.length}));
        })
        .catch((error)=> {
            logger.error(JSON.stringify(error));
            return res.send(new Result(103, {message: error.message}));
        });
});

router.post('/words/wordExercisesForToday/updateResult', function (req, res) {
    const progresses = req.body.content;
    if (progresses == undefined || !(progresses instanceof Array)) {
        return res.send(new Result(105));
    }

    wordsExercisesLib.updateWordExerciseProgresses(progresses)
        .then((saves)=>{
            logger.info(`update succeed : ${saves.length}`);
            return res.send(new Result(0, {count: saves.length}));
        })
        .catch((error)=>{
            logger.error(JSON.stringify(error));
            return res.send(new Result(105, {error: error}));
        });
});

router.post('/create', function (req, res) {
    if (!req.session.user) {
        return res.send(new Result(8));
    }

    const mail = req.session.user.mail,
        title = req.body.title.trim(),
        description = req.body.description.trim(),
        answer = req.body.answer;

    let options = [req.body.optionA, req.body.optionB, req.body.optionC, req.body.optionD].map((str)=> {
            return str.trim()
        }),
        hints = req.body.hints.split(';').map((str)=> {
            return str.trim()
        }),
        tags = req.body.tags.split(';').map((str)=> {
            return str.trim()
        });

    options = options.filter(filterEmpty);
    hints = hints.filter(filterEmpty);
    tags = tags.filter(filterEmpty);

    if (description == '' || options.length == 0 || answer == '') {
        const message = '必填项不能为空';
        const result = new Result(101, {message});
        logger.info(JSON.stringify(result));
        return res.send(result);
    }

    const newExercise = new Exercise.makeExercise(
        mail,
        title,
        description,
        parseInt(answer),
        options,
        hints,
        tags
    );

    newExercise.save()
        .then(()=> {
            const result = new Result(0, {message: '已经保存'});
            logger.info(JSON.stringify(result));
            return res.send(result);
        })
        .catch(()=> {
            const result = new Result(101, {message: '保存错误'});
            logger.info(JSON.stringify(result));
            return res.send(result);
        });

})
;

router.post('/words/create', function (req, res) {
    if (!req.session.user) {
        return res.send(new Result(8));
    }

    const mail = req.session.user.mail,
        word = req.body.word.trim(),
        partOfSpeech = req.body.partOfSpeech.trim(),
        explanation = req.body.explanation.trim(),
        example = req.body.example.trim(),
        exampleExplanation = req.body.exampleExplanation.trim(),
        others = req.body.others.trim();

    if (word == '' ||
        partOfSpeech == '' ||
        explanation == '' ||
        example == '' ||
        exampleExplanation == '') {

        const message = '必填项不能为空';
        const result = new Result(102, {message});
        logger.info(JSON.stringify(result));
        return res.send(result);
    }

    const newWordExercise = WordExercise.MakeWordExercise(
        mail,
        word,
        partOfSpeech,
        explanation,
        example,
        exampleExplanation,
        others
    );

    newWordExercise.save()
        .then(()=> {
            const result = new Result(0, {message: '已经保存'});
            logger.info(JSON.stringify(result));
            return res.send(result);
        })
        .catch(()=> {
            const result = new Result(101, {message: '保存错误'});
            logger.info(JSON.stringify(result));
            return res.send(result);
        });
});

function filterEmpty(elem) {
    return elem != undefined && elem != '';
}

module.exports = router;