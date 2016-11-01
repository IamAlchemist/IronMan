/**
 * Created by wizard on 11/1/16.
 */
'use strict';

const http = require('http');

const server = http.createServer();
server.on('request', function(req, res) {
    console.log('HTTP', req.method, req.url);
    let n = 0;
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': 100
    });

    const inter = setInterval(function() {
        res.write('.');
        n++;
        if (n >= 100) {
            clearInterval(inter);
            res.end();
        }
    }, 50);

    res.on('error', function(err) {
        console.log(err);
    });

    res.on('close', function() {
        console.log('Connection close');
    })
});

server.listen(8000);