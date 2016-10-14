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
//const itemNameClass = '.title_1ytnru0-o_O-reducedMargin_zu6h1b';
const descriptionClass = '.description_svya6c';

const khan = 'https://www.khanacademy.org';

snatchURL(mathUrl, snatchSubMath);

function snatchURL(url, cb) {
    console.log("... working on url : " + url);
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];

            $(tableItemClass)
                .each(function (idx, element) {

                    var $element = $(element);
                    var title = $element.find('h3').text();
                    var href = $element.find(linkClass).attr('href');
                    var desc = $element.find(descriptionClass).text();

                    items.push({
                        title: title,
                        href: href,
                        desc: desc
                    });
                });

            cb(items)
        });
}

function snatchSubMath(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchURL(url, snatchGold);
    });
}

function snatchGold(items) {
    items.forEach(function (item) {
        console.log(item.href);
    });
}