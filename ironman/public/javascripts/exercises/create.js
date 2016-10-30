/**
 * Created by wizard on 10/26/16.
 */

require([], function () {
    var messageElem;

    $(document).ready(function () {
        "use strict";
        messageElem = $('p#message');

        setupCreateForm();
    });

    function setupCreateForm() {
        const createForm = $('form#create');

        createForm.submit(function (event) {
            event.preventDefault();

            const form = $(this);

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
            }).done(function (data) {
                let msg = data.errorCode == 0 ? data.content.message : data.message;
                messageElem.text(msg);
                if (data.errorCode == 0) {
                    createForm[0].reset();
                }
                else if (data.errorCode == 8) {
                    window.location.replace('/users/login');
                }
            })
        });
    }
});
