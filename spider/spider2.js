/**
 * Created by wizard on 10/13/16.
 */

const superagent = require('superagent');
const cheerio = require('cheerio');

const testUrl = 'http://dict.cn/would rather';
//const testUrl = 'http://dict.cn/sky';

function process(url) {
    console.log("... working on url : " + url);
    superagent
        .get(url)
        .end((err, sres)=> {
            "use strict";
            if (err) {
                throw err;
            }

            let $ = cheerio.load(sres.text, {decodeEntities: false});

            let explanation = $('.dict-basic-ul');

            if (explanation.html() == null) {
                explanation = $('ul', '.basic.clearfix');
                let content = explanation.find('li').slice(0).eq(0).find('strong');
                console.log(content.html());
            }
            else {
                const node = explanation.find('li').slice(0).eq(0);
                const partOfSpeech = node.find('span');
                console.log(partOfSpeech.html());

                const content = node.find('strong');
                console.log(content.html());
            }

            const prononce = $('.phonetic');
            const value = prononce.find('span').slice(1).eq(0).find('.sound.fsound').attr('naudio').split('?')[0];
            console.log(`http://audio.dict.cn/${value}`);

            const more = $('.shape');
            let moreContent = "";

            more.find('span').each((idx, elem)=> {
                let $elem = $(elem);
                moreContent += $elem.children('label').html();
                moreContent += $elem.children('a').text();
                moreContent += ";"
            });
            console.log(moreContent);

            const example = $('.layout.sort');
            const text = example.children('ol').slice(0).eq(0).children('li').slice(0).eq(0).text();
            for (let str of text.split('\n')) {
                console.log(str.trim());
            }
        })
}

process(testUrl);
//test();