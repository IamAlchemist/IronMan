/**
 * Created by wizard on 11/1/16.
 */

require(['../../libs/ironmanLib'], function (ironmanLib) {
    var messageElem;
    var contentElem;
    var hintElem;
    var nextButtonCotainerElem;
    var nextButtonElem;

    var originalWordExerciseProgresses;
    var wordExerciseProgresses = Array();

    var exerciseTmpl;
    var wordDetailTmpl;

    var currentWordExerciseProgress;
    var currentWordExerciseProgressIndex;

    var currentAnswerIndex;
    var currentHints;
    var currentHintIndex = 0;
    var hintUsed = false;

    var currentChoosedId;

    $(document).ready(function () {
        contentElem = $('#content');

        initStartMemorizing();
    });

    function startMemorizing() {
        for (let progress of originalWordExerciseProgresses) {
            var clone = cloneObject(progress);
            wordExerciseProgresses.push(clone);
        }

        pickNextWordProgress();

        showCurrentWordExerciseProgress();
    }

    function pickNextWordProgress() {
        if (currentWordExerciseProgressIndex == undefined) {
            currentWordExerciseProgressIndex = 0;
            currentWordExerciseProgress = wordExerciseProgresses[0];
        }
        else {
            let i = 0;
            let l = wordExerciseProgresses.length;
            for (; i < l; ++i) {
                currentWordExerciseProgressIndex += 1;
                if (currentWordExerciseProgressIndex >= wordExerciseProgresses.length) {
                    currentWordExerciseProgressIndex = 0;
                }

                if (wordExerciseProgresses[currentWordExerciseProgressIndex].progress
                    - originalWordExerciseProgresses[currentWordExerciseProgressIndex].progress < 3) {
                    currentWordExerciseProgress = wordExerciseProgresses[currentWordExerciseProgressIndex];
                    break;
                }
            }

            if (i == l) {
                return false;
            }
        }

        return true;
    }

    function showCurrentWordDetail() {
        if (wordDetailTmpl == undefined) {
            let source = $("#wordDetail-template").html();
            wordDetailTmpl = Handlebars.compile(source);
        }

        const html = wordDetailTmpl(currentWordExerciseProgress.wordExercise);
        contentElem.html(html);

        initNextExerciseButtonInDetail();
    }

    function numberOfAvaiableWordProgresses() {
        let result = 0;
        for (let i = 0, l = wordExerciseProgresses.length; i < l; ++i) {
            if (wordExerciseProgresses[i].progress - originalWordExerciseProgresses[i].progress < 3) {
                result += 1;
            }
        }

        return result;
    }

    function initNextExerciseButtonInDetail() {
        let nextButton = $('#nextWordExerciseButton');
        if (numberOfAvaiableWordProgresses() > 1) {
            nextButton.removeAttr('disabled');
        }
        else {
            nextButton.attr('disabled', 'disabled');
        }

        nextButton.click(()=> {
            if (pickNextWordProgress()) {
                showCurrentWordExerciseProgress();
            }
        });
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
        messageElem = $('p#message');

        initOKButton();

        initNextButton();

        initSkipButton();

        initTipsButton();
    }

    function advanceCurrentProgress(advanced) {
        currentWordExerciseProgress.progress += advanced;
        currentWordExerciseProgress.progress = Math.max(currentWordExerciseProgress.progress, 0);
        currentWordExerciseProgress.progress = Math.min(currentWordExerciseProgress.progress, 9);
    }

    function initSkipButton() {
        $('#skipButton').click(()=> {
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

    function initNextButton() {
        nextButtonCotainerElem = $('#nextExerciseContainer').hide();
        nextButtonElem = $('#nextExercise');
        nextButtonElem.click(()=> {
            if (numberOfAvaiableWordProgresses() == 0) {
                sendResultToServer();
            }
            else {
                pickNextWordProgress();
                showCurrentWordExerciseProgress();
            }
        });
    }

    function showExerciseDonePage() {
        alert("done");
    }

    function sendResultToServer() {
        const url = "/exercises/words/wordExercisesForToday/updateResult";
        const data = {"content": wordExerciseProgresses};
        let posting = $.ajax(url,
            {
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            });

        posting.done(function (response) {
            if (response.errorCode == 0) {
                showExerciseDonePage();
            }
            else {
                messageElem.text(response.message);
            }
        });
    }

    function initOKButton() {
        currentChoosedId = undefined;

        $("#okButton").click(function () {
            if (currentChoosedId != undefined) {
                let components = currentChoosedId.split('_');

                // now you make the right answer
                if (components.length == 2
                    && components[0] == currentWordExerciseProgress._id
                    && components[1] == currentAnswerIndex) {

                    advanceCurrentProgress(3);

                    $(this).parent().hide();
                    answerSucceed();
                }
                else { //opps, the answer is wrong
                    advanceCurrentProgress(-3);
                    showCurrentWordDetail();
                }
            }
            else {
                messageElem.text("请做选择");
            }
        });
    }

    function answerSucceed() {
        if (numberOfAvaiableWordProgresses() == 0) {
            nextButtonElem.text("完成");
        }
        nextButtonCotainerElem.show();
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
                        if (originalWordExerciseProgresses.length == 0) {
                            messageElem.text('no more exercises');
                        }
                        else {
                            startMemorizing();
                        }
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