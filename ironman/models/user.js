'use strict';

const mongoose = require('../libs/mongodb');

const UserModel = mongoose.model('User', {
    mail: String,
    password: String
});

function User(user) {
    this.mail = user.mail;
    this.password = user.password;
}

User.prototype.save = function (callback) {
    var newUser = new UserModel(this);
    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.getByMail = function (mail) {
    return UserModel.findOne({mail: mail}).exec();
};

module.exports = User;