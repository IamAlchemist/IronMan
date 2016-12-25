/**
 * Created by wizard on 11/1/16.
 */

const Promise = require('bluebird').Promise,
    fs = require('fs'),
    readFile = Promise.promisify(fs.readFile),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    logger = require('../libs/ironmanLogger');

function preprocess() {
    readFile(`./categories_words_raw.txt`, "utf8")
        .then((content)=>{
            let alllines = content.split('\n');
            logger.warn(`all lines count : ${alllines.length}`);

            let string = "";
            for (let line of alllines) {
                //const word = line.trim().split('(')[0].trim();
                const  words = line.trim().split('=');

                for (let word of words) {
                    string += word.trim() + '\n';
                }
            }

            fs.writeFile(`./categories_words_raw_2.txt`, string);
        });
}

preprocess();
