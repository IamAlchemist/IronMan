/**
 * Created by wizard on 23/12/2016.
 */
const express = require('express'),
    Result = require('../libs/api-result'),
    logger = require('../libs/ironmanLogger'),
    Exercise = require('../models/exercise'),
    WordExercise = require('../models/wordExercise'),
    wordsExercisesLib = require('../libs/wordsExercisesLib'),
    exercisesLib = require('../libs/exercisesLib'),
    punching = require('../models/punchingRecord'),
    comonLib = require('../libs/commonLib'),
    Promise = require('bluebird').Promise,
    router = express.Router();

router.get('/words/statistics', (req, res) => {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    wordsExercisesLib.statisticsDataForUser(user)
        .then((dataSets)=>{
            return res.send(new Result(0, dataSets));
        });
});

module.exports = router;