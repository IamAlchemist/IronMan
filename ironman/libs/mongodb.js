/**
 * Created by wizard on 10/23/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
module.exports = mongoose;
