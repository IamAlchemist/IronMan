/**
 * Created by wizard on 11/2/16.
 */

require([], function () {
    $(document).ready(function () {
        $('#clickbutton').click(function () {
            let arrays = Array();
            arrays.push("hello");
            arrays.push("world");

            let data = {content: arrays};

            $.ajax(
                {
                    url: '/test',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                })
                .done(function () {
                    alert("ok");
                });
        });

        var source = $("#entry-template").html();
        var template1 = Handlebars.compile(source);
        var context1 = {title: "My New Post", body: "This is my first post!"};
        var html1 = template1(context1);

        var listContext =
        {
            people: [
                {firstName: "Yehuda", lastName: "Katz"},
                {firstName: "Carl", lastName: "Lerche"},
                {firstName: "Alan", lastName: "Johnson"}
            ]
        };

        Handlebars.registerHelper('list', function (items, options) {
            var out = "<ul>";

            for (var i = 0, l = items.length; i < l; i++) {
                out = out + "<li>" + options.fn(items[i]) + "</li>";
            }

            return out + "</ul>";
        });

        var source2 = $("#list-template").html();
        var template2 = Handlebars.compile(source2);
        var html2 = template2(listContext);

        var pathContext = {
            title: "My First Blog Post!",
            author: {
                id: 47,
                name: "Yehuda Katz"
            },
            body: "My first post. Wheeeee!"
        };

        var source3 = $("#path-template").html();
        var template3 = Handlebars.compile(source3);
        var html3 = template3(pathContext);

        var exercise = {
            _id: "_my_id",
            title: "单选",
            description: "please choose the right one:",
            options: ["a", "b", "c", "d"]
        };

        var source4 = $("#exercise-template").html();
        var template4 = Handlebars.compile(source4);
        var html4 = template4(exercise);

        var source5 = $("#celebration-template").html();
        var template5 = Handlebars.compile(source5);
        let progresses = Array();
        for (let i = 0 ; i < 5; ++i) {
            progresses.push({
                word: "nice",
                explanation: "good",
                progress: 40
            });
        }
        var html5 = template5(progresses);
        $('#content').html(html5);
    });
});