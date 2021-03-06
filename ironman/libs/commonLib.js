/**
 * Created by wizard on 11/8/16.
 */

const mongodb = require('./mongodb'),
    Promise = require('bluebird'),
    User = require('../models/user'),
    logger = require('../libs/ironmanLogger');

module.exports.getUserFromRequest = function (req) {
    return req.session.user;
};


module.exports.linkUser = function (mail, linkedUserMail) {
    let originUser;
    return User.UserModel.findOne({mail}).exec()
        .then((user)=> {
            originUser = user;
            return User.UserModel.findOne({mail: linkedUserMail}).exec();
        })
        .then((linkedUser)=> {
            if (originUser.isStudent == linkedUser.isStudent) {
                throw new Error("绑定的账户和原账户类型不能相同");
            }

            let linkedUserMails = new Set(originUser.linkedUserMails);
            linkedUserMails.add(linkedUserMail);
            originUser.linkedUserMails = Array.from(linkedUserMails);
            logger.info(`updated original user : ${JSON.stringify(originUser)}`);

            linkedUserMails = new Set(linkedUser.linkedUserMails);
            linkedUserMails.add(mail);
            linkedUser.linkedUserMails = Array.from(linkedUserMails);
            logger.info(`updated linked user : ${JSON.stringify(linkedUser)}`);

            return Promise.all([linkedUser.save(), originUser.save()]);
        })
        .catch((error)=> {
            logger.error(`link user error : ${error}`);
            throw error;
        });
};




