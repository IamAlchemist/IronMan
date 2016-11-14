/**
 * Created by wizard on 11/14/16.
 */

require(['./libs/ironmanLib'], function (ironmanLib) {
    $(document).ready(function () {
        $('#loginButton').click(()=> {
            window.location.replace('/users/login');
        });
    });
});