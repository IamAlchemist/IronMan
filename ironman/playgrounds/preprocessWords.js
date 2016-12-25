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
    readFile(`./nine_grade_half_b.csv`, "utf8")
        .then((content)=>{
            let alllines = content.split('\n');
            logger.warn(`all lines count : ${alllines.length}`);

            let string = "";
            for (let line of alllines) {
                const word = line.trim();
//                const  words = line.trim().split('=');
                if (word.length > 0) {
                    string += word.trim() + '\n';
                }
            }

            fs.writeFile(`./nine_grade_half_b_raw.txt`, string);
        });
}

preprocess();
