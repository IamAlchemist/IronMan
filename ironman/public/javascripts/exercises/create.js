/**
 * Created by wizard on 10/26/16.
 */

require(['../libs/ironmanLib'], function (ironmanLib) {
    var messageElem;

    $(document).ready(function () {
        "use strict";
        messageElem = $('p#message');

        ironmanLib.setupForm($('form#create'), function (data) {
            let msg = data.content != undefined ? data.content.message : undefined;
            msg = msg == undefined ? data.message : msg;
            messageElem.text(msg);
        });
    });
});
