/**
 * Created by wizard on 11/11/16.
 */

const Promise = require('bluebird'),
    fs = require('fs'),
    program = require('commander'),
    WordExercise = require('../models/wordExercise'),
    logger = require('../libs/ironmanLogger');

program
    .version('0.0.1')
    .option('-S, --source [file]', 'source Of words [file]', '')
    .option('-m, --mail [mail]', 'source Of words [mail]', '')
    .parse(process.argv);

console.log('import word exercises:');
console.log(`from : ${program.source}`);
console.log(`mail : ${program.mail}`);

if (!program.source) {
    console.log('need parameter');
    process.exit(1);
}

function importWordExercises(jsonFile, mail) {
    var words = JSON.parse(fs.readFileSync(`./${jsonFile}`, 'utf8'));

    logger.info(`count: ${words.length}`);

    words = words.map((word)=> {
        word.mail = mail;
        return word;
    });

    var promises = words.map((word)=> {

        return WordExercise.MakeWordExercise(
            word.mail,
            word.word,
            word.partOfSpeech,
            word.explanation,
            word.example,
            word.exampleExplanation,
            word.pronunciation,
            word.others
        ).save();

    });

    const final = new Promise.all(promises);

    final.then((results)=> {
        logger.info(`${jsonFile} succeed: ${results.length}`)
    });
}

importWordExercises(program.source, program.mail);

