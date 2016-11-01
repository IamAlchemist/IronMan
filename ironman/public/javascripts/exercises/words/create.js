/**
 * Created by wizard on 11/1/16.
 */

require(['../../libs/ironmanLib'], function (ironmanLib) {
    var messageElem;

    $(document).ready(function () {
        "use strict";
        messageElem = $('p#message');
        const forms = $('form#create');

        ironmanLib.setupCreateForm(forms, function (data) {
            let msg = data.content != undefined ? data.content.message : undefined;
            msg = msg == undefined ? data.message : msg;
            messageElem.text(msg);
        });
    });
});
