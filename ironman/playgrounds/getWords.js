/**
 * Created by wizard on 11/1/16.
 */

const Promise = require('bluebird').Promise,
    fs = require('fs'),
    readFile = Promise.promisify(fs.readFile),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    logger = require('../libs/ironmanLogger');

function preprocess(from, to) {
    readFile(`./${from}`, "utf8")
        .then((content)=>{
            let alllines = content.split('\n');
            logger.warn(`${alllines.length}`);

            let string = "";
            for (let line of alllines) {
                string += line.trim().split('/')[0] + '\n';
            }

            fs.writeFile(`./${to}`, string);
        });
}
