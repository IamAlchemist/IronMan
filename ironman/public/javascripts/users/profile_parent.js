'use strict';

var messageAlert;
var lib;
require(['../libs/ironmanLib'], function (ironmanLib) {
    lib = ironmanLib;
    $(document).ready(function () {
        messageAlert = $('#messageAlert');
    });
});

function punchingHomeworkFor(mail) {
    const type = "homework";
    $.getJSON(`/exercises/punching/punchForChild?child=${mail}&type=${type}`)
        .done((json)=>{
            let message = json.content != undefined && json.content.message != undefined ?
                json.content.message : json.message;
            let alertClass = json.errorCode != 0 ? 'alert-danger' : 'alert-success';
            messageAlert.html(lib.alert(message, alertClass));

            if (json.errorCode == 0) {
                window.location.reload();
            }
        });
}
