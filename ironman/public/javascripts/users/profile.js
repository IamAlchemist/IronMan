'use strict';
require(['../libs/ironmanLib'], function (ironmanLib) {
    let punchingButton;
    let punchingCount;
    let messageAlert;

    $(document).ready(function () {
        punchingButton = $('#punchingButton');
        punchingCount = $('#punchingCount');
        messageAlert = $('#messageAlert');

        punchingButton.click(function () {
            punchForHomework();
        });

        updatePunching();

        updatePunchingToday();
    });

    function updatePunching() {
        let type = "homework";
        $.getJSON(`/exercises/punching/count?punchingType=${type}`)
            .done((json)=> {
                let message = ironmanLib.getMessageFromJson(json);

                if (json.errorCode != 0) {
                    let alertClass = 'alert-danger';
                    messageAlert.html(ironmanLib.alert(message, alertClass));
                }
                else {
                    punchingCount.text(json.content.count);
                }
            });
    }

    function punchForHomework() {
        punchingButton.attr({disabled: true});
        $.getJSON('/exercises/punching/homework')
            .done((json)=> {
                let message = ironmanLib.getMessageFromJson(json);

                if (json.errorCode != 0) {
                    let alertClass = 'alert-danger';
                    messageAlert.html(ironmanLib.alert(message, alertClass));
                    enablePunchingButton();
                }
                else {
                    disablePunchingButton();
                    updatePunching();
                }
            });

    }

    function disablePunchingButton() {
        punchingButton.removeClass('btn-info');
        punchingButton.addClass('btn-success');
        punchingButton.attr({disabled: true});
        punchingButton.text("已经完成打卡");
    }

    function enablePunchingButton() {
        punchingButton.removeClass('btn-success');
        punchingButton.addClass('btn-info');
        punchingButton.attr({disabled: false});
        punchingButton.text("按时完成打卡");
    }

    function updatePunchingToday() {
        let type = "homework";
        $.getJSON(`/exercises/punching/isPunched?punchingType=${type}`)
            .done((json)=> {
                let message = ironmanLib.getMessageFromJson(json);

                if (json.errorCode != 0) {
                    let alertClass = 'alert-danger';
                    messageAlert.html(ironmanLib.alert(message, alertClass));
                }
                else {
                    if (json.content.isPunched) {
                        disablePunchingButton();
                    }
                    else {
                        enablePunchingButton();
                    }
                }
            });
    }
});

