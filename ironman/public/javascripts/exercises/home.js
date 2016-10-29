/**
 * Created by wizard on 10/23/16.
 */

$(document).ready(function () {
    var inputs = $('input');
    inputs.iCheck({
        radioClass: 'iradio_square-green',
        increaseArea: '20%'
    });

    inputs.on('ifChecked', event => {
        console.log(event.target.id);
    });
});
