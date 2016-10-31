/**
 * Created by wizard on 10/23/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird').Promise;
mongoose.connect('mongodb://localhost/IronMan');
module.exports = mongoose;
