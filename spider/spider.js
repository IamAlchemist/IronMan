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

const khan = 'https://www.khanacademy.org';

function snatchSubjectFromURL(url, cb) {
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
exports.snatchSubjectFromURL = snatchSubjectFromURL;

function snatchSubSubject(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchSubjectFromURL(url, snatchClass);
    });
}
exports.snatchSubSubject = snatchSubSubject;

function snatchClass(items) {
    items.forEach(function (item) {
        var url = khan + item.href;
        snatchClassFromURL(url);
    });
}

var goldItemClass = ".nodeTitle_1lw7ui1";
function snatchClassFromURL(url, cb) {
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

            cb(items);
        });
}
exports.snatchClassFromURL = snatchClassFromURL;
