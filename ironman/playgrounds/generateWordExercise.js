/**
 * Created by wizard on 11/11/16.
 */

const Promise = require('bluebird').Promise,
    fs = require('fs'),
    readFile = Promise.promisify(fs.readFile),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    program = require('commander'),
    logger = require('../libs/ironmanLogger');

program
    .version('0.0.1')
    .option('-S, --source [file]', 'source Of words [file]', '')
    .option('-D, --destination [file]', 'json of wordExercises [file]', '')
    .parse(process.argv);

console.log('generate word exercises:');
console.log(`from : ${program.source}`);
console.log(`to : ${program.destination}`);
if (!program.source || !program.destination) {
    console.log('need parameter');
    process.exit(1);
}

function processAWord(word) {
    const wordURL = `http://dict.cn/${word}`;

    return new Promise(function (resolve) {
        superagent
            .get(wordURL)
            .end((err, sres)=> {
                logger.info(`word: ${word}`);

                if (err) {
                    logger.error(err.message);
                    throw err;
                }

                let $ = cheerio.load(sres.text, {decodeEntities: false});

                let explanation = null;
                let partOfSpeech = null;
                let pronunciation = null;
                let others = "";
                let example = null;
                let exampleExplanation = null;

                let explanationNode = $('.dict-basic-ul');

                if (explanationNode.html() == null) {
                    explanationNode = $('ul', '.basic.clearfix');
                    explanation = explanationNode.find('li').slice(0).eq(0).find('strong').html();
                }
                else {
                    const node = explanationNode.find('li').slice(0).eq(0);
                    const partOfSpeechNode = node.find('span');
                    partOfSpeech = partOfSpeechNode.html();
                    explanation = node.find('strong').html();
                }

                // logger.info(`explanation : ${explanation}, part: ${partOfSpeech}`);

                const prononceNode = $('.phonetic');
                const prononceElem = prononceNode.find('span').slice(1).eq(0).find('.sound.fsound').attr('naudio');
                if (prononceElem != undefined) {
                    const value = prononceElem.split('?')[0];
                    pronunciation = `http://audio.dict.cn/${value}`;
                }

                // logger.info(`explanation : ${pronunciation}`);

                const moreNode = $('.shape');

                moreNode.find('span').each((idx, elem)=> {
                    let $elem = $(elem);
                    others += $elem.children('label').html();
                    others += $elem.children('a').text();
                    others += ";"
                });

                // logger.info(`others : ${others}`);

                const exampleNode = $('.layout.sort');
                const texts = exampleNode.children('ol').slice(0).eq(0).children('li').slice(0).eq(0).text().split('\n');
                let length = texts.length;
                if (length > 0) {
                    example = texts[0].trim();
                }
                if (length > 1) {
                    exampleExplanation = texts[1].trim();
                }
                // logger.info(`example : ${example}`);

                resolve({word, explanation, partOfSpeech, pronunciation, others, example, exampleExplanation});
            });
    });
}

var wordExercises = [];
var allwords = [];

function processWords(start) {
    logger.warn(`start to handle : ${start}`);
    if (start + 50 <= allwords.length) {
        let toProcess = allwords.slice(start, start + 50);
        const promises = toProcess.map(word => processAWord(word));

        return Promise.all(promises)
            .then((things)=> {
                wordExercises = wordExercises.concat(things);
                processWords(start + 50);
            });
    }
    else if (start < allwords.length) {
        let toProcess = allwords.slice(start);
        const promises = toProcess.map(word => processAWord(word));

        return Promise.all(promises)
            .then((things)=> {
                wordExercises = wordExercises.concat(things);
                processWords(start + 50);
            });
    }
    else {
        logger.warn(`total : ${wordExercises.length}`);
        fs.writeFile(`./${program.destination}`, JSON.stringify(wordExercises, null, 2));
    }
}

function processAll() {

    readFile(`./${program.source}`, "utf8")

        .then((contents) => {
            allwords = contents.split('\n');
            return processWords(0);
        })

        .catch((e) => {
            logger.error(`e: ${e.message}`);
        });

}

processAll();






