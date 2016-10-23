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

router.get('/learn', function(req, res, next) {
    var options = new Array(3);

    for (var i = 0; i < 3; ++i) {
        options[i] = {
            id: `option_${i}`,
            name: 'option_name',
            description: 'option_description'
        };
    }
    var exercise = {
        question: 'exer_question',
        description: 'exer_description',
        options
    };

    var params = {
        exercise
    };

    res.render('learn', params);
});

module.exports = router;
