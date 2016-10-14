/**
 * Created by wizard on 10/14/16.
 */

const cheerio = require('cheerio');

const text = '<ul id="fruits"> <li class="apple">Apple</li> <li class="orange">Orange</li> <li class="pear">Pear</li></ul>';

$ = cheerio.load(text);

var element = $('#fruits');
console.log(element.find('.apple').length);

var items = [];

element.find('li').each(function (idx, item) {
    items.push($(item).text())
});

console.log(items);

items.forEach(function (item, idx) {
    console.log(item + ":" + idx);
});


