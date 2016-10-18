/**
 * Created by wizard on 10/18/16.
 */

const spider = require('./spider');

const subSubjectURL = 'https://www.khanacademy.org/math/early-math/';

spider.snatchSubjectFromURL(subSubjectURL, function (items) {
    items.forEach(function (item) {
        console.log(item.href);
    })
});
