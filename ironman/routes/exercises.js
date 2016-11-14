/**
 * Created by wizard on 10/23/16.
 */
'use strict';

const express = require('express'),
    Result = require('../libs/api-result'),
    logger = require('../libs/ironmanLogger'),
    Exercise = require('../models/exercise'),
    WordExercise = require('../models/wordExercise'),
    wordsExercisesLib = require('../libs/wordsExercisesLib'),
    punching = require('../models/punchingRecord'),
    comonLib = require('../libs/commonLib'),
    Promise = require('bluebird').Promise,
    router = express.Router();

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
router.get('/words/inspect/progressToday', (req, res)=> {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    if (user.isStudent) {
        return res.send(new Result(109));
    }

    if (user.linkedUserMails.length == 0) {
        return res.send(new Result(111));
    }

    wordsExercisesLib.inspectAchievementToday(user)
        .then((content)=> {
            return res.send(new Result(0, content))
        })
        .catch(()=> {
            return res.send(new Result(110));
        })
});

router.get('/words/isPunched', (req, res)=> {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    if (!user.isStudent) {
        return res.send(new Result(108));
    }

    punching.isPunchedToday(user.mail)
        .then((isPunched)=> {
            return res.send(new Result(0, {isPunched}));
        });
});

router.get('/words/achievementToday', (req, res)=> {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    wordsExercisesLib.achievementToday(user.mail)
        .then((progresses)=> {
            res.send(new Result(0, {progressesToday: progresses}));
        })
        .catch(()=> {
            res.send(new Result(107));
        });
});

router.get('/punching/isPunched', (req, res)=>{
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    if (!user.isStudent) {
        return res.send(new Result(108));
    }

    let type = req.query.punchingType;
    if(!checkPunchingType(type)) {
        return res.send(new Result(10));
    }

    punching.isPunchedToday(user.mail, type)
        .then((isPunched)=> {
            return res.send(new Result(0, {isPunched}));
        });

});

router.get('/punching/count', (req, res) => {
    const user = comonLib.getUserFromRequest(req);
    if (!user) { return res.send(new Result(8)); }

    const type = req.query.punchingType;

    if (!checkPunchingType(type)) {
        return res.send(new Result(10));
    }

    punching.punchingCountHomework(user.mail, type)
        .then((count)=>{
            return res.send(new Result(0, {count}));
        })
        .catch((error)=>{
            return res.send(new Result(114, {message: error.message}));
        })
});

router.get('/punching/homework', (req, res) => {
    const user = comonLib.getUserFromRequest(req);
    if (!user) { return res.send(new Result(8)); }

    punching.punchForHomework(user.mail)
        .then(()=>{
            return res.send(new Result(0));
        })
        .catch((error)=>{
            return res.send(new Result(113, {message: error.message}));
        })
});

router.get('/words/wordExercisesForToday', (req, res)=> {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

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

router.get('/words/bank/import', (req, res)=> {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    if (req.query == undefined || req.query.grade == undefined) {
        logger.error(JSON.stringify(req.query));
        return res.send(new Result(112));
    }

    wordsExercisesLib.importWords(user.mail, req.query.grade)
        .then(()=> {
            res.send(new Result(0));
        })
        .catch((e) => {
            logger.error(e.message);
            return res.send(new Result(112));
        })
    ;

});

router.get('/words/bank/update', function (req, res) {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

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
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    const progresses = req.body.content;

    if (progresses == undefined || !(progresses instanceof Array)) {
        return res.send(new Result(105));
    }

    wordsExercisesLib.updateWordExerciseProgresses(progresses)

        .then((saves)=> {
            logger.info(`update succeed : ${saves.length}`);
            return new Promise(function (resolve) {
                resolve(saves.length);
            });
        })

        .then((count)=> {
            punching.punchToday(user.mail);
            return res.send(new Result(0, {count}));
        })

        .catch((error)=> {
            logger.error(JSON.stringify(error));
            return res.send(new Result(105, {error: error}));
        });
});

router.post('/create', function (req, res) {
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    const mail = user.mail,
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
    const user = comonLib.getUserFromRequest(req);
    if (!user) {
        return res.send(new Result(8));
    }

    const mail = user.mail,
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

function checkPunchingType(type) {
    if (type == undefined) return false;

    let typeIsCorrect = false;
    for (let key in punching.PunchingType) {
        if (punching.PunchingType[key] == type) {
            typeIsCorrect = true;
            break;
        }
    }
    return typeIsCorrect;
}

module.exports = router;