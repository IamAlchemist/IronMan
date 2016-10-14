/**
 * Created by wizard on 10/13/16.
 */

const superagent = require('superagent');
const cheerio = require('cheerio');

//const url = 'https://www.khanacademy.org/math/algebra-home';
const url = 'https://cnodejs.org/';

superagent.get(url)
    .end(function (err, sres) {
        if (err) { return next(err); }

        var $ = cheerio.load(sres.text);
        var items = [];

        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);

            items.push({
                title: $element.attr('title'),
                href: $element.attr('href')
            })
        });

        console.log(items)
    });
