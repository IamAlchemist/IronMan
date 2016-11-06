/**
 * Created by wizard on 10/23/16.
 */

require([], function () {

    $(document).ready(function () {
        decorateRadioInputs();
    });

    function decorateRadioInputs() {
        var inputs = $('input[type=radio]');
        inputs.iCheck({
            radioClass: 'iradio_square-green',
            increaseArea: '20%'
        });

        inputs.on('ifChecked', function (event) {
            console.log(event.target.id);
        });
    }

});
