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

User.prototype.save = function () {
    return UserModel(this).save();
};

User.getByMail = function (mail) {
    return UserModel.findOne({mail: mail}).exec();
};

module.exports = User;