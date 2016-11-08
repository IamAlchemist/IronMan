/**
 * Created by wizard on 10/23/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise;
mongoose.connect('mongodb://localhost/IronMan');
mongoose.throwIfMissing = function () {
    throw new Error('Missing parameter');
};

module.exports = mongoose;
