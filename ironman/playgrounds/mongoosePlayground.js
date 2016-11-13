'use strict';
const logger = require('../libs/ironmanLogger');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const timestamp = require('../libs/mongoose-timestamp');
const moment = require('moment');
mongoose.Promise = bluebird.Promise;
const mongodb = mongoose.connect('mongodb://localhost/test');
const assert = require('assert');

const WordSchema = new mongodb.Schema({
    word: String
});
WordSchema.plugin(timestamp);
const WordModel = mongodb.model('Word', WordSchema);


const WordProgressModel = mongodb.model('WordProgress', {
    progress: Number,
    word: Object
});

class Word {
    constructor(word) {
        Object.assign(this, {word});
    }

    save() {
        return WordModel(this).save();
    }
}

function query() {
    WordModel.find({}).sort('-_id')
        .then((words)=> {
            console.log(words.length);
            if (words.length > 0) {
                console.log(JSON.stringify(words[0]));
            }
        })
        .catch((error)=> {
            console.log(JSON.stringify(error));
        });
}

function insertAWordProgress() {
    WordModel.find({}).exec()
        .then((word)=> {
            const progress = new WordProgressModel({
                progress: 0,
                word
            });

            logger.info(JSON.stringify(progress));

            progress.save()
                .then((progress)=> {
                    logger.info(JSON.stringify(progress));
                });
        });
}

function insertAWord(wordString) {
    const word = new Word(wordString);
    word.save()
        .then((sth)=> {
            logger.info('success' + JSON.stringify(sth));
        })
        .catch((err)=> {
            logger.info('fail' + JSON.stringify(err));
        });
}

function showWord() {
    WordProgressModel.findOne({progress: 0})
        .then((progress)=> {
            logger.warn(progress.word.word);
        });
}

function showChain() {
    WordProgressModel.findOne({progress: 0}).exec()
        .then((progress)=> {
            console.log(progress.progress);
            return WordModel.findOne({word: progress.word.word}).exec()
        })
        .then((word)=> {
            console.log(word.word)
        })
}


function demo() {
    const id = '5818b43d515b5aca2ba1662d';
    WordProgressModel.find({}).sort('-word._id').exec()
        .then((progresses)=> {
            const last = progresses[0];
            console.log("fk 1:");
            const nice = WordModel.find({}).where('_id').gt(last.word._id).exec();
            console.log("fk 2:");
            return nice;

            // console.log(`progresses size : ${progresses.length}`);
            // console.log(`progresses [0] : ${progresses[0]}`);
            // let array = progresses.map((prog)=>{
            //     return WordModel.find({}).where('_id').gt(prog.word._id).exec();
            // });
            // console.log("fk ---- :" + JSON.stringify(array));
            // return Promise.all(array);
        })
        .then((words)=> {
            console.log(`words size : ${words.length}`);
            console.log(words[0].constructor);
        })
        .catch((error)=> {
            console.log("fk:" + JSON.stringify(error));
        });
}

function update() {
    WordProgressModel
        .find({})
        .exec()
        .then((progresses)=> {
            let ids = progresses.map(prog => prog._id);
            return WordProgressModel.find({
                '_id': {
                    $in: ids
                }
            }).exec();
        })
        .then((progresses) => {
            return progresses.map((progress)=> {
                progress.progress = 6;
                return progress.save();
            });
        })
        .then((progresses)=> {
            console.log(`${progresses.length}`);
        });
}

function queryDate() {
    var startOfDay = moment().startOf('day');
    var endOfDay = moment().endOf('day');


    WordModel.findOne({
        createdAt: {
            $gte: startOfDay.toDate(),
            $lte: endOfDay.toDate()
        }
    }).exec()
        .then((word)=> {
            console.log(`word : ${JSON.stringify(word)}`);
        })
        .catch((error)=> {
            console.log(JSON.stringify(error, null, "  "));
        });
}

function save() {
    const word = "test";
    const wordm = WordModel({word});
    wordm.save();
}

function count() {
    const query = WordModel.count({});
    const promise = query.exec();
    assert.ok(promise instanceof bluebird.Promise);

    promise.then((num)=>{
        console.log(`num: ${num}`);
    });

}
count();
//save();
//queryDate();
//update();
//demo();
//insertAWord();
//insertAWordProgress();
//showWord();
//showChain();
//query();
