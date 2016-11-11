/**
 * Created by wizard on 11/11/16.
 */

const Promise = require('bluebird').Promise,
    readFile = Promise.promisify(require('fs').readFile),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    logger = require('../libs/ironmanLogger');

function process(word) {
    const wordURL = `http://dict.cn/${word}`;
    logger.info("... working on url : " + wordURL);

    return new Promise(function (resolve) {
        superagent
            .get(wordURL)
            .end((err, sres)=> {
                if (err) { throw err; }

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

                const prononceNode = $('.phonetic');
                const value = prononceNode.find('span').slice(1).eq(0).find('.sound.fsound').attr('naudio').split('?')[0];
                pronunciation = `http://audio.dict.cn/${value}`;

                const moreNode = $('.shape');

                moreNode.find('span').each((idx, elem)=> {
                    let $elem = $(elem);
                    others += $elem.children('label').html();
                    others += $elem.children('a').text();
                    others += ";"
                });

                const exampleNode = $('.layout.sort');
                const texts = exampleNode.children('ol').slice(0).eq(0).children('li').slice(0).eq(0).text().split('\n');
                let length = texts.length;
                if (length > 0) { example = texts[0].trim(); }
                if (length > 1) { exampleExplanation = texts[1].trim(); }


                resolve({word, explanation, partOfSpeech, pronunciation, others, example, exampleExplanation });
            });
    });
}


readFile("./nine-grade-half-a.csv", "utf8")

    .then((contents) => {
        const words = contents.split('\r\n');
        const testwords = words.slice(0,2);
        const promises = testwords.map(word => process(word));
        return Promise.all(promises)
    })

    .then((things)=>{
        for (thing of things){
            logger.warn(JSON.stringify(thing, null, 2));
        }
    })

    .catch( (e) => {
        logger.error(`Error reading file, ${e}`);
    });






