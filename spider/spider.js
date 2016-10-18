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

const topicListClass = '.list_1clqkf3';
const topicNameClass = '.link_1uvuyao';
const topicListItemClass = '.nodeTitle_1lw7ui1';

const khan = 'https://www.khanacademy.org';

const testUrl = 'https://www.khanacademy.org/math/early-math/cc-early-math-counting-topic';
//snatchURL(mathUrl, snatchSubMath);
snatchGoldPageFromURL(testUrl);

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
        snatchURL(url, snatchGoldPage);
    });
}

function snatchGoldPage(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchGoldPageFromURL(url);
    });
}

function snatchGoldPageFromURL(url) {
    console.log('snatch gold page from : ' + url);

    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];

            $(topicListClass)
                .each(function (idx, element) {
                    var $element = $(element);
                    var title = $element.find(topicNameClass).text();
                    var href = $element.find(topicNameClass).attr('href');

                    items.push({
                        title: title,
                        href: href,
                    });
                });

            snatchClass(items);
        });
}

var goldItemInVideoPageClass = '.containerSubwayTracks_15zais5';
var goldVideoPageClass = '.link_1uvuyao-o_O-link_m6j4io-o_O-linkSubwayTracks_19zvu2s';

function snatchClassFromURL(url) {
    console.log('snatch class from : ' + url);
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];

            $('video')
                .each(function (idx, element) {
                    console.log('find video');
                    var $element = $(element);
                    var href = $element.attr('src');

                    items.push({
                        href: href,
                    });
                });

            console.log(items);
        });
}
function snatchClass(items) {
    items.forEach(function (item, idx) {
        var url = khan + item.href;
        snatchClassFromURL(url);
    });
}

