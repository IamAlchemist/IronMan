/**
 * Created by wizard on 11/3/16.
 */

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

const UserPunchingOutSchema = new Schema({
    mail: String
});

UserPunchingOutSchema.plugin(timestamps);