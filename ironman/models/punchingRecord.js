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
    mail: String
});

PunchingRecordSchema.plugin(timestamps);

const PunchingRecordModel = mongodb.model('PunchingRecord', PunchingRecordSchema);
module.exports.PunchingRecordModel = PunchingRecordModel;

module.exports.MakePunchingRecord = function (mail = mongodb.throwIfMissing()) {
    return new PunchingRecordModel({mail});
};

module.exports.punchToday = function (mail) {
    const punch = new PunchingRecordModel({mail});
    return punch.save()

        .catch((error)=> {
            logger.error(error.message);
            throw error;
        });
};

module.exports.isPunchedToday = function (mail) {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    return PunchingRecordModel.findOne(
        {
            mail,
            createdAt: {
                $gte: startOfDay.toDate(),
                $lte: endOfDay.toDate()
            }
        }).exec()

        .then((punching)=> {
            return new Promise(function (resolve) {
                resolve(punching != null)
            });
        })
};

