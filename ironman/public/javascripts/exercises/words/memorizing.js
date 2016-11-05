/**
 * Created by wizard on 11/1/16.
 */

require(['../../libs/ironmanLib'], function (ironmanLib) {
    var messageElem;
    var contentElem;
    var hintElem;

    var originalWordExerciseProgresses;
    var wordExerciseProgresses = Array();


    var exerciseTmpl;
    var wordDetailTmpl;

    var currentWordExerciseProgress;
    var currentAnswerIndex;
    var currentHints;
    var currentHintIndex = 0;
    var hintUsed = false;

    var currentChoosedId;

    $(document).ready(function () {
        messageElem = $('p#message');
        contentElem = $('#content');

        initStartMemorizing();
    });

    function startMemorizing() {
        for (let progress of originalWordExerciseProgresses) {
            var clone = cloneObject(progress);
            wordExerciseProgresses.push(clone);
        }

        currentWordExerciseProgress = wordExerciseProgresses[0];

        showCurrentWordExerciseProgress();
    }

    function showCurrentWordDetail() {
        if (wordDetailTmpl == undefined) {
            let source = $("#wordDetail-template").html();
            wordDetailTmpl = Handlebars.compile(source);
        }

        const html = wordDetailTmpl(currentWordExerciseProgress.wordExercise);
        contentElem.html(html);
    }

    function showCurrentWordExerciseProgress() {
        const exercise = {
            _id: currentWordExerciseProgress._id,
            title: "单选",
            description: `${currentWordExerciseProgress.wordExercise.word}的含义是:`,
            options: generateCurrentOptionsAndSetAnswerIndex(),
        };

        generateHints();

        if (exerciseTmpl == undefined) {
            let source = $("#wordExercise-template").html();
            exerciseTmpl = Handlebars.compile(source);
        }

        const html = exerciseTmpl(exercise);

        contentElem.html(html);

        ironmanLib.decorateRadioInputs(function (targetId) {
            currentChoosedId = targetId;
        });

        hintElem = $('#hintMessage');

        initOKButton();

        initSkipButton();

        initTipsButton();
    }
    
    function advanceCurrentProgress(advanced) {
        currentWordExerciseProgress.progress += advanced;
        currentWordExerciseProgress.progress = Math.max(currentWordExerciseProgress.progress, 0);
        currentWordExerciseProgress.progress = Math.min(currentWordExerciseProgress.progress, 9);
    }

    function initSkipButton() {
        $('#skipButton').click(()=>{
            advanceCurrentProgress(-3);
            showCurrentWordDetail();
        });
    }

    function initTipsButton() {
        currentHintIndex = 0;
        const tipsButton = $('#showTipsButton');
        tipsButton.text('提示');
        tipsButton.removeAttr('disabled');
        const hintCount = currentHints.length;
        if (hintCount == 0) {
            tipsButton.attr('disabled', 'disabled');
        }

        tipsButton.click(() => {
            if (!hintUsed) {
                advanceCurrentProgress(-1);
                hintUsed = true;
            }

            if (currentHintIndex == 0 && currentHintIndex < hintCount) {
                tipsButton.text('下一个提示');
            }

            let hintMessage = "";

            for (let i = 0; i <= currentHintIndex && i < hintCount; ++i) {
                hintMessage = hintMessage.concat("<br/>").concat(currentHints[i]);
            }

            hintElem.html(hintMessage);

            currentHintIndex += 1;

            if (currentHintIndex >= hintCount) {
                tipsButton.attr('disabled', 'disabled');
            }
        });
    }

    function initOKButton() {
        $("#okButton").click( function () {
            if (currentChoosedId != undefined) {
                let components = currentChoosedId.split('_');
                if (components.length == 2
                    && components[0] == currentWordExerciseProgress._id
                    && components[1] == currentAnswerIndex) {

                    advanceCurrentProgress(3);
                }
            }
            else {
                advanceCurrentProgress(-3);
                showCurrentWordDetail();
            }
        });
    }

    function generateHints() {
        currentHints = Array();
        currentHints.push(currentWordExerciseProgress.wordExercise.example);
        currentHints.push(currentWordExerciseProgress.wordExercise.exampleExplanation);
    }

    function generateCurrentOptionsAndSetAnswerIndex() {
        let otherOptions = Array();
        const answer = getWordFrom(currentWordExerciseProgress);

        let otherOptionsNumber = originalWordExerciseProgresses.length - 1;
        otherOptionsNumber = Math.min(3, otherOptionsNumber);

        for (let i = 0; i < otherOptionsNumber; ++i) {
            let option = getAnOption();
            if (option == answer) {
                i -= 1;
            }
            else {
                otherOptions.push(option);
            }
        }

        currentAnswerIndex = Math.floor(Math.random() * (otherOptionsNumber + 1));

        var options = Array();
        for (let i = 0; i < currentAnswerIndex; ++i) {
            options.push(otherOptions[i]);
        }

        options.push(answer);

        for (let i = currentAnswerIndex; i < otherOptionsNumber; ++i) {
            options.push(otherOptions[i]);
        }

        return options
    }

    function getAnOption() {
        let index = Math.floor(Math.random() * originalWordExerciseProgresses.length);
        return originalWordExerciseProgresses[index].wordExercise.explanation;
    }

    function getWordFrom(progress) {
        return progress.wordExercise.explanation;
    }

    function initStartMemorizing() {
        const source = $('#startMemorizing-template').html();
        const startMemorizingTmpl = Handlebars.compile(source);

        contentElem.html(startMemorizingTmpl());
        initStartMemorizingButton();
    }

    function initStartMemorizingButton() {
        $('button#startMemorizing').click(function () {
            $.getJSON('/exercises/words/wordExercisesForToday')
                .done(function (result) {
                    if (result.errorCode == 0) {
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