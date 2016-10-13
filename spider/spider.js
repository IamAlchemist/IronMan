/**
 * Created by wizard on 10/13/16.
 */

const https = require('https');

https.get('https://www.khanacademy.org/math/algebra-home', (res) => {
    console.log('statusCode: ', res.statusCode);
    console.log('headers: ', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });

}).on('error', (e) => {
    console.error(e);
});

