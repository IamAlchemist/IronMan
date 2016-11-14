/**
 * Created by wizard on 11/14/16.
 */
const mongodb = require('./mongodb'),
    Promise = require('bluebird').Promise,
    Punching = require('../models/punchingRecord'),
    logger = require('../libs/ironmanLogger');

module.exports.punchingHomeworkForParent = function (user) {
    if (user.linkedUserMails == undefined || user.linkedUserMails.length == 0) {
        return new Promise(function (resolve) {
            resolve([]);
        });
    }

    const mails = user.linkedUserMails;

    let promises = mails.map((mail)=> {
        let type = Punching.PunchingType.homework;
        return Punching.PunchingRecordModel.find({mail, type}).exec();
    });

    let datas = [];

    return Promise.all(promises)
        .then((arrayOfRecords)=> {

            arrayOfRecords.map((records, index) => {
                datas[index] = {mail: mails[index], count: records.length}
            });

            let ps = mails.map((mail)=> {
                let type = Punching.PunchingType.homework;
                return Punching.isPunchedToday(mail, type);
            });

            return Promise.all(ps);
        })

        .then((arrayOfIsPunched)=>{
            arrayOfIsPunched.map((isPunched, index) => {
                datas[index]["today"] = isPunched;
            });

            return new Promise(function (resolve) {
                resolve(datas);
            });
        })

        .catch((e)=>{
            logger.error(e.message);
            throw e;
        })
};