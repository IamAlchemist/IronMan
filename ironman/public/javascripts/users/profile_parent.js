'use strict';
require(['../libs/ironmanLib'], function (ironmanLib) {
    let messageAlert;

    $(document).ready(function () {
        messageAlert = $('#messageAlert');
    });
});

function punchingHomeworkFor(mail) {
    alert(mail);
}
