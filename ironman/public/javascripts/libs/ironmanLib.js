/**
 * Created by wizard on 11/1/16.
 */

define(function (){
    var add = function (x,y){
        return x+y;
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

    return {
        add: add,
        setupCreateForm: setupCreateForm
    };
});