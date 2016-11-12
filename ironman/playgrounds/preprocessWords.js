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
    readFile(`./eight_grade_half_a2.txt`, "utf8")
        .then((content)=>{
            let alllines = content.split('\n');
            logger.warn(`all lines count : ${alllines.length}`);

            let string = "";
            for (let line of alllines) {
                const word = line.trim().split('.')[1].trim();
                string += word + '\n';
            }

            fs.writeFile(`./eight_grade_half_b.txt`, string);
        });
}

preprocess();
