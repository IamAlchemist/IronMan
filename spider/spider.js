/**
 * Created by wizard on 10/13/16.
 */

const superagent = require('superagent');
const cheerio = require('cheerio');

const mathUrl = 'https://www.khanacademy.org/math';
//const url = 'https://www.khanacademy.org/math/algebra-home';
//const url = 'https://www.khanacademy.org/math/geometry-home';
//const url = 'https://cnodejs.org/';

const tableItemClass =  '.content_1gdgprv-o_O-contentOnBottom_rfy4py';
const linkClass = '.link_1uvuyao-o_O-noUnderlineOnHover_gzi9n-o_O-blurb_1692lk9';
const itemNameClass = '.title_1ytnru0-o_O-reducedMargin_zu6h1b';
const descriptionClass = '.description_svya6c';

superagent.get(mathUrl)
    .end(function (err, sres) {
        if (err) { return next(err); }

        var $ = cheerio.load(sres.text);
        var items = [];

        $(linkClass, tableItemClass)
            .each(function (idx, element) {
                var $element = $(element);
                items.push({
                    href: $element.attr('href')
                });
            });

        console.log(items)
    });
