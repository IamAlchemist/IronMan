/**
 * Created by wizard on 10/26/16.
 */

$(document).ready(function () {
    $('form#add').submit(function (event) {
        var form = $(this);
        alert('nice');
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize()
        }).success(function () {
            alert('ok');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert('fail');
        });
    });
});
