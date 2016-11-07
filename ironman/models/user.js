'use strict';

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;


const UserSchema = new Schema({
    mail: String,
    password: String,
    isStudent: Boolean
});
UserSchema.plugin(timestamps);

const UserModel = mongodb.model('User', UserSchema);
module.exports.UserModel = UserModel;

module.exports.makeUser = function (mail, password, isStudent = true) {
    return new UserModel({
        mail,
        password,
        isStudent
    });
};