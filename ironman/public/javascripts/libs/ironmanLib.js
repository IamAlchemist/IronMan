/**
 * Created by wizard on 11/1/16.
 */

define(function () {
    var add = function (x, y) {
        return x + y;
    };

    function setupForm(jqElem, callback) {

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

    function alert(message, className) {
        return `<div class="alert ${className} alert-dismissible" role="alert">
                  <button type="button" class="close" data-dismiss="alert">
                      <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                  </button>
                  ${message}
                </div>`;
    }

    function getMessageFromJson(json) {
        return json.content != undefined && json.content.message != undefined ?
            json.content.message : json.message;
    }

    return {
        add: add,
        alert: alert,
        setupForm: setupForm,
        decorateRadioInputs: decorateRadioInputs,
        getMessageFromJson: getMessageFromJson

    };
});