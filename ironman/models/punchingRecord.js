/**
 * Created by wizard on 11/9/16.
 */

const moment = require('moment');
const logger = require('../libs/ironmanLogger');
const mongodb = require('../libs/mongodb');
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

        .catch((error)=>{
            logger.error(error.message);
            throw error;
        });
};

module.exports.didPunchToday = function (mail) {
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
            return new mongodb.Promise(function (resolve) {
                resolve(punching != null)
            });
        })
};

