/**
 * Created by wizard on 11/1/16.
 */

require(['../../libs/ironmanLib'], function (ironmanLib) {
    let messageAlertElem;

    $(document).ready(function () {
        messageAlertElem = $('#messageAlert');
        setupWordsBandUpdateButton();
        setupImportWordsFromNineHalfA();
    });

    function setupImportWordsFromNineHalfA() {
        $('#importWordsFromNineGradeHalfA').click(()=> {
            const button = $(this);
            button.attr({disabled: true});

            $.getJSON('/exercises/words/bank/import?grade=nine.grade.half.a@gmail.com')
                .done((json)=>{
                    let message = json.content != undefined && json.content.message != undefined ?
                        json.content.message : json.message;

                    let alertClass = json.errorCode != 0 ? 'alert-danger' : 'alert-success';
                    messageAlertElem.html(ironmanLib.alert(message, alertClass));

                    button.attr({disabled: false});
                });
        });
    }

    function setupWordsBandUpdateButton() {
        $('#updateWordsBankButton').click(function () {
            const button = $(this);
            button.attr({disabled: true});

            $.getJSON('/exercises/words/bank/update', function (json) {
                let message = json.content != undefined && json.content.message != undefined ?
                    json.content.message : json.message;

                let alertClass = json.errorCode != 0 ? 'alert-danger' : 'alert-success';
                messageAlertElem.html(ironmanLib.alert(message, alertClass));

                button.attr({disabled: false});
            })
        });
    }

});