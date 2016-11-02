/**
 * Created by wizard on 11/2/16.
 */

require([], function () {
    $(document).ready(function () {
        var source   = $("#entry-template").html();
        var template = Handlebars.compile(source);
        var context = {title: "My New Post", body: "This is my first post!"};
        var html    = template(context);

        $('#content').html(html);
    });
});