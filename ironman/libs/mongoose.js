/**
 * Created by wizard on 10/23/16.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
module.exports = mongoose;
