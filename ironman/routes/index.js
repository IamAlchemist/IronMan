var express = require('express');
const logger = require('../libs/ironmanLogger');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {

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

router.get('/test', function (req, res) {
    res.render('test');
});

router.post('/test', function (req, res) {
    logger.info(`fuck: ${req.body.content.length}`);
    for (let key in req.body) {
        logger.info("key:" + key);
    }
    return res.send({errorCode: 0});
});
module.exports = router;
