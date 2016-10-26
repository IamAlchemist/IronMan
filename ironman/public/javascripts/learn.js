/**
 * Created by wizard on 10/26/16.
 */

require([], function (){
    $(document).ready(function () {
        $('form#add').submit(function (event) {
            event.preventDefault();
            var form = $(this);
            console.log(form.serialize());
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize()
            }).done(function () {
                alert('ok');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert('fail');
            });
        });
    });
});

