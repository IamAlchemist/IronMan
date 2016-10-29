require([], function () {
    var messageElem;

    $(document).ready(function () {
        messageElem = $('p#message');

        $('form#login').submit(function (event) {
            event.preventDefault();

            const form = $(this);

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
            }).done(function (data) {
                messageElem.text(data.message);
            })

        });
    });
});