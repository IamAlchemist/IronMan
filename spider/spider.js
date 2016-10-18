/**
 * Created by wizard on 10/13/16.
 */

const superagent = require('superagent');
const cheerio = require('cheerio');

const mathUrl = 'https://www.khanacademy.org/math';
const testUrl = 'https://www.khanacademy.org/math/early-math/cc-early-math-counting-topic';

const tableItemClass =  '.content_1gdgprv-o_O-contentOnBottom_rfy4py';
const subSubjectLinkClass = '.link_1uvuyao-o_O-noUnderlineOnHover_gzi9n-o_O-blurb_1692lk9';
const descriptionClass = '.description_svya6c';

const topicListClass = '.list_1clqkf3';
const topicNameClass = '.link_1uvuyao';

const khan = 'https://www.khanacademy.org';

//snatchSubject(mathUrl, snatchSubSubject);


snatchClassFromURL(testUrl);

function snatchSubject(url, cb) {
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
                    var href = $element.find(subSubjectLinkClass).attr('href');
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

function snatchSubSubject(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchSubject(url, snatchGoldPage);
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

var goldItemClass = ".nodeTitle_1lw7ui1";
function snatchClassFromURL(url) {
    console.log('snatch class from : ' + url);
    superagent.get(url)
        .end(function (err, sres) {
            if (err) {
                return console.log(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];

            $(goldItemClass)
                .each(function (idx, element) {
                    var $element = $(element).find('span').first();
                    if (!$element.text().startsWith('Practice:')) {
                        items.push({
                            class: $element.text(),
                        });

                    }
                });

            console.log(items);
        });
}

function snatchClass(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchClassFromURL(url);
    });
}

