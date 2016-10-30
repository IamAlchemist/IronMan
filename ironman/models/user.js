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

User.get = function (name, callback) {
    UserModel.findOne({mail: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = User;