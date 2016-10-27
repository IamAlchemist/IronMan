var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var book = {
        poster: "poster",
        title: "title",
        buyUrl: "buyUrl"
    };
    var books = new Array(3).fill(book);


    var options = {
        title: 'Express',
        books: books
    };

    res.render('index', options);
});


module.exports = router;
