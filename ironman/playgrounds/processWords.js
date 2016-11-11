/**
 * Created by wizard on 11/11/16.
 */

const Promise = require('bluebird').Promise,
    fs = require('fs'),
    readFile = Promise.promisify(fs.readFile),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    logger = require('../libs/ironmanLogger');

function process(word) {
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
                let pronunciation;
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
                const value = prononceNode.find('span').slice(1).eq(0).find('.sound.fsound').attr('naudio').split('?')[0];
                pronunciation = `http://audio.dict.cn/${value}`;

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

readFile("./nine_grade_half_a.csv", "utf8")

    .then((contents) => {
        allwords = contents.split('\r\n');
        logger.warn(`all words count : ${allwords.length}`);
        let words = allwords.slice(0,50);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(50,100);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(100,150);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(150,200);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(200,250);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(250,300);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(300,350);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        logger.warn(`total : ${wordExercises.length}`);
        wordExercises = wordExercises.concat(things);
        let words = allwords.slice(350);
        const promises = words.map(word => process(word));
        return Promise.all(promises);
    })

    .then((things)=> {
        wordExercises = wordExercises.concat(things);
        logger.warn(`total : ${wordExercises.length}`);
        fs.writeFile('./nine_grade_half_a.json', JSON.stringify(wordExercises, null, 2));
    })


    .catch((e) => {
        logger.error(`e: ${e.message}`);
    });






