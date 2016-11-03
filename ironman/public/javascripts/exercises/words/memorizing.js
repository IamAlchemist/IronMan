/**
 * Created by wizard on 11/1/16.
 */

require([], function () {
    var messageElem;

    var originalWordExerciseProgresses;
    var wordExerciseProgresses = Array();
    var currentWordExercise;
    var contentElem;

    $(document).ready(function () {
        messageElem = $('p#message');
        contentElem = $('#content');

        initStartMemorizing();
        initStartMemorizingButton();
    });

    function startMemorizing() {
        for (let progress of originalWordExerciseProgresses) {
            var clone = cloneObject(progress);
            wordExerciseProgresses.push(clone);
        }

        currentWordExercise = wordExerciseProgresses[0];

        showCurrentWordExercise();
    }

    function showCurrentWordExercise() {

    }

    function initStartMemorizing() {
        const source = $('#startMemorizing-template').html();
        const templ = Handlebars.compile(source);
        contentElem.html(templ());
    }

    function initStartMemorizingButton() {
        $('button#startMemorizing').click(function () {
            $.getJSON('/exercises/words/wordExercisesForToday')
                .done(function (result) {
                    if (result.errorCode == 0){
                        originalWordExerciseProgresses = result.content;
                        startMemorizing();
                    }
                    else {
                        messageElem.text(result.message);
                    }
                })
                .fail(function (error) {
                    messageElem.text(JSON.stringify(error));
                });
        });
    }

    function cloneObject(origin) {
        let originProto = Object.getPrototypeOf(origin);
        return Object.assign(Object.create(originProto), origin);
    }
});