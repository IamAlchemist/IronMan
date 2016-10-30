/**
 * Created by wizard on 10/23/16.
 */

const express = require('express');
const router = express.Router();
const mongoose = require('../libs/mongodb');

router.get('/', function (req, res) {
    var options = new Array(3);

    for (var i = 0; i < 3; ++i) {
        options[i] = {
            id: `option_${i}`,
            name: 'option_name',
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

module.exports = router;