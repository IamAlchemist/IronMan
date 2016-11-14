/**
 * Created by wizard on 11/14/16.
 */

const mongodb = require('../libs/mongodb');
const timestamps = require('../libs/mongoose-timestamp');
const Schema = mongodb.Schema;

const WordExerciseSourceSchema = new Schema({
    mail: String,
    wordOwners: [String]
});

WordExerciseSourceSchema.plugin(timestamps);
const WordExerciseSourceModel = mongodb.model('WordExerciseSource', WordExerciseSourceSchema);

module.exports.WordExerciseSourceModel = WordExerciseSourceModel;

module.exports.updateWordOwnersOf = function (mail = mongodb.throwIfMissing(),
                                        wordOwners = mongodb.throwIfMissing()) {
    return WordExerciseSourceModel.findOne({mail}).exec()
        .then((source)=> {
            if (source == null) {
                const model = WordExerciseSourceModel({mail, wordOwners});
                return model.save();
            }
            else {
                let allOwners = source.wordOwners.concat(wordOwners);
                wordOwners = Array.from(new Set(allOwners));
                return WordExerciseSourceModel.update({mail}, {wordOwners}).exec();
            }
        })
};

module.exports.wordOwnersOf = function (mail = mongodb.throwIfMissing()) {
    return WordExerciseSourceModel.findOne({mail})
        .then((source)=>{
            return new Promise(function (resolve) {
                if (source == null) {
                    return resolve([]);
                }
                else {
                    return resolve(source.wordOwners);
                }
            });
        });
};



