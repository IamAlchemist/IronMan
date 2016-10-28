const mongoose = require('../libs/mongodb');

const UserModel = mongoose.model('User', {
    name: String,
    password: String
});

function User(user) {
    this.name = user.name;
    this.password = user.password;
}

User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password
    };

    var newUser = new UserModel(user);
    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

User.get = function (name, callback) {
    UserModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = User;