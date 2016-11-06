/**
 * Created by wizard on 11/1/16.
 */

define(function () {
    var add = function (x, y) {
        return x + y;
    };

    function setupCreateForm(jqElem, callback) {

        jqElem.submit(function (event) {
            event.preventDefault();

            const form = $(this);

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),

            }).done(function (data) {
                if (data.errorCode == 8) {
                    window.location.replace('/users/login');
                }
                else {
                    if (data.errorCode == 0) {
                        jqElem[0].reset();
                    }

                    callback(data);
                }
            })
        });
    }

    function decorateRadioInputs(callback) {
        var inputs = $('input[type=radio]');
        inputs.iCheck({
            radioClass: 'iradio_square-green',
            increaseArea: '20%'
        });

        inputs.on('ifChecked', function (event) {
            if (callback != undefined) {
                callback(event.target.id);
            }
            else {
                console.log(event.target.id);
            }
        });
    }

    return {
        add: add,
        setupCreateForm: setupCreateForm,
        decorateRadioInputs: decorateRadioInputs
    };
});