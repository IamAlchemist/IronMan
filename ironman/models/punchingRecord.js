/**
 * Created by wizard on 11/9/16.
 */

const moment = require('moment'),
    logger = require('../libs/ironmanLogger'),
    Promise = require('bluebird').Promise,
    mongodb = require('../libs/mongodb');

const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

const PunchingRecordSchema = new Schema({
    mail: String,
    type: String,
});

PunchingRecordSchema.plugin(timestamps);

const PunchingRecordModel = mongodb.model('PunchingRecord', PunchingRecordSchema);
module.exports.PunchingRecordModel = PunchingRecordModel;

module.exports.MakePunchingRecord = function (mail = mongodb.throwIfMissing(), type = PunchingType.word) {
    return new PunchingRecordModel({mail, type});
};

module.exports.punchingCountHomework = function punchingCountHomework(mail, type) {
    return PunchingRecordModel.count(
        {
            mail,
            type
        }).exec()

        .then((num)=> {
            return new Promise(function (resolve) {
                resolve(num);
            });
        })

        .catch((e)=>{
            logger.error(e.message);
            throw e;
        });
};

module.exports.punchForHomework = function (mail) {
    const current = moment();
    const hour = current.hour();
    const min = current.minute();
    if (hour < 22 || (hour == 22 && min < 30)) {
        return isPunchedToday(mail, PunchingType.homework)
            .then((punched)=> {
                if (punched) {
                    throw new Error('already punched');
                }

                return punchToday(mail, PunchingType.homework);
            });
    }
    else {
        throw new Error('time is out');
    }
};

module.exports.punchToday = function punchToday(mail, type = PunchingType.word) {
    const punch = new PunchingRecordModel({mail, type});
    return punch.save()

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

module.exports.isPunchedToday = function isPunchedToday(mail, type = PunchingType.word) {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    return PunchingRecordModel.findOne(
        {
            mail,
            type,
            createdAt: {
                $gte: startOfDay.toDate(),
                $lte: endOfDay.toDate()
            }
        }).exec()

        .then((punching)=> {
            return new Promise(function (resolve) {
                resolve(punching != null)
            });
        });
};


const PunchingType = {word: "word", homework: "homework"};
module.exports.PunchingType = PunchingType;

