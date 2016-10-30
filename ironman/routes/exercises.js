/**
 * Created by wizard on 10/23/16.
 */
'use strict';

const express = require('express');
const Result = require('../libs/api-result');
const logger = require('../libs/ironmanLogger');
const mongodb = require('../libs/mongodb');

const router = express.Router();

router.get('/', function (req, res) {
    var options = new Array(3);

    for (var i = 0; i < 3; ++i) {
        options[i] = {
            id: `option_${i}`,
            mail: 'option_name',
            description: 'option_description'
        };
    }
    var exercise = {
        question: 'exer_question',
        description: 'exer_description',
        options
    };

    var params = {
        exercise
    };

    res.render('exercises/home', params);
});

router.get('/create', function (req, res) {
    var params = {};
    res.render('exercises/create', params)
});

router.post('/create', function (req, res) {
    const username = req.session.user.mail,
        title = req.body.title,
        description = req.body.description,
        answer = req.body.answer;

    let options = [req.body.optionA, req.body.optionB, req.body.optionC, req.body.optionD],
        hints = req.body.hints.split(';'),
        tags = req.body.tags.split(';');

    options = options.filter(filterEmpty);
    hints = hints.filter(filterEmpty);
    tags = tags.filter(filterEmpty);

    if (description == '' || options.length == 0 || answer == '') {
        const message = '必填项不能为空';
        const result = new Result(101, {message});
        logger.info(JSON.stringify(result));
        return res.send(result);
    }



    function filterEmpty(elem) {
        return elem != undefined && elem != '';
    }
});


module.exports = router;