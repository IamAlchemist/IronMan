/**
 * Created by wizard on 10/15/16.
 */

var phantom = require('phantom');

var sitepage = null;
var phInstance = null;
phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        return page.open('https://baidu.com');
    })
    .then(status => {
        console.log(status);
        return sitepage.property('content');
    })
    // .then(content => {
    //     setTimeout(function () {
    //         console.log("delayed");
    //     }, 3000);
    // })
    // .then(function () {
    //     console.log("finish");
    //     })
    // .then(content => {
    //     console.log(content);
    //     sitepage.close();
    //     phInstance.exit();
    // })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });

setTimeout(function () {
    sitepage.property('content').then(content => {
            console.log(content);
            sitepage.close();
            phInstance.exit();
        }
    );

}, 5000);

