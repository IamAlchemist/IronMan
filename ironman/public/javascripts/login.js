require([], function () {
    var messageElem;

    $(document).ready(function () {
        messageElem = $('p#message');

        setupLoginForm();
    });

    function setupLoginForm() {
        $('form#login').submit(function (event) {
            event.preventDefault();

            const form = $(this);

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
            }).done(function (data) {

                messageElem.text(data.message);
                if (data.errorCode == 0) {
                    window.location.replace('/users/profile');
                }
            })

        });
    }
});

