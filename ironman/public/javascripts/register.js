'use strict';

require([], function () {
    var messageElem;

    $(document).ready(function () {
        messageElem = $('p#message');

        setupRegisterForm();
    });

    function setupRegisterForm() {
        $('form#register').submit(function (event) {
            event.preventDefault();

            const form = $(this);

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),

            }).done(function (data) {
                const message = data.errorCode == 0 ? '注册成功，请去登录' : data.message;
                messageElem.text(message);
            })

        });
    }
});
