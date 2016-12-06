/**
 * Created by wizard on 11/1/16.
 */

require(['../../libs/ironmanLib', 'http://cdn.bootcss.com/moment.js/2.17.0/moment.min.js'], function (ironmanLib, moment) {
    var contentElem;
    var progressElem;
    var progressBarElem;
    var totalNumberElem;
    var messageAlertElem;

    var messageElem;
    var hintElem;
    var nextButtonCotainerElem;
    var nextButtonElem;

    var originalWordExerciseProgresses;
    var wordExerciseProgresses = Array();

    var exerciseTmpl;
    var wordDetailTmpl;
    var celebrationTmpl;
    var inspectionTmpl;

    var currentWordExerciseProgress;
    var currentWordExerciseProgressIndex;

    var currentAnswerIndex;
    var currentHints;
    var currentHintIndex = 0;
    var hintUsed = false;

    var currentChoosedId;

    const maxPoint = 24;

    $(document).ready(function () {
        contentElem = $('#content');
        progressElem = $('#progress');
        progressElem.hide();
        progressBarElem = $('#progressbar');
        totalNumberElem = $('#totalNumber');
        messageAlertElem = $('#messageAlert');

        initStartMemorizing();
    });

    function htmlFromWordExercisProgresses(wordExerciseProgresses, title) {
        if (celebrationTmpl == undefined) {
            let source = $('#celebration-template').html();
            celebrationTmpl = Handlebars.compile(source);
        }

        const progresses = wordExerciseProgresses.map((p)=> {
            const word = p.wordExercise.word;
            const explanation = p.wordExercise.explanation;
            const progress = Math.floor(p.progress * 100 / maxPoint);

            return {word, explanation, progress};
        });

        return celebrationTmpl({title, progresses});
    }

    function showCelebrationPage(wordExerciseProgresses) {
        const html = htmlFromWordExercisProgresses(wordExerciseProgresses);
        contentElem.html(html);

        progressElem.hide();
    }

    function startMemorizing() {
        for (let progress of originalWordExerciseProgresses) {
            var clone = cloneObject(progress);
            wordExerciseProgresses.push(clone);
        }

        totalNumberElem.text(`共 ${wordExerciseProgresses.length} 题`);

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
        progressElem.hide();

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

        nextButton.click(function () {
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

        progressElem.show();

        initOKButton();

        initNextButton();

        initSkipButton();

        initTipsButton();
    }

    function advanceCurrentProgress(advanced) {
        currentWordExerciseProgress.progress += advanced;
        currentWordExerciseProgress.progress = Math.max(currentWordExerciseProgress.progress, 0);
        currentWordExerciseProgress.progress = Math.min(currentWordExerciseProgress.progress, maxPoint);
    }

    function initSkipButton() {
        $('#skipButton').click(function () {
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

        tipsButton.click(function () {
            if (!hintUsed) {
                advanceCurrentProgress(-1);
                hintUsed = true;
            }

            if (currentHintIndex == 0 && currentHintIndex < hintCount) {
                tipsButton.text('下一个提示');
            }

            let hintMessage = "";

            for (let i = 0; i <= currentHintIndex && i < hintCount; ++i) {
                const padding = hintMessage == 0 ? "" : "<br/><br/>";
                hintMessage = hintMessage.concat(padding).concat(currentHints[i]);
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
        nextButtonElem.click(function () {
            if (numberOfAvaiableWordProgresses() == 0) {
                sendResultToServer();
            }
            else {
                pickNextWordProgress();
                showCurrentWordExerciseProgress();
            }
        });
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
                showCelebrationPage(wordExerciseProgresses);
            }
            else {
                messageElem.text(response.message);
            }
        });
    }

    function initOKButton() {
        currentChoosedId = undefined;

        const okButton = $("#okButton");

        okButton.click(function () {
            if (currentChoosedId != undefined) {
                let components = currentChoosedId.split('_');

                // now you make the right answer
                if (components.length == 2
                    && components[0] == currentWordExerciseProgress._id
                    && components[1] == currentAnswerIndex) {

                    advanceCurrentProgress(3);
                    $('#skipButton').attr('disabled', 'disabled');

                    $(this).parent().hide();
                    answerSucceed();
                }
                else { //opps, the answer is wrong
                    okButton.attr('disabled', 'disabled');
                    okButton.removeClass('btn-success');
                    okButton.addClass('btn-danger');
                    okButton.text('选错了呢，右边按钮可以看答案呢...');
                    advanceCurrentProgress(-3);
                }
            }
            else {
                messageElem.text("请做选择");
            }
        });
    }

    function answerSucceed() {
        const total = wordExerciseProgresses.length;
        const correctAnswerNumber = (total - numberOfAvaiableWordProgresses());
        const p = Math.floor((correctAnswerNumber / total) * 100);

        totalNumberElem.text(`共 ${correctAnswerNumber}/${originalWordExerciseProgresses.length} 题`);
        progressBarElem.attr('style', `width: ${p}%;`);

        if (correctAnswerNumber == total) {
            nextButtonElem.text("上传学习结果");
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
        $.getJSON('/exercises/words/isPunched')

            .done((result)=> {
                if (result.errorCode == 0) {
                    if (result.content.isPunched) {

                        $.getJSON('/exercises/words/achievementToday')
                            .done((res)=> {
                                if (res.errorCode == 0) {
                                    const progress = res.content.progressesToday;
                                    showCelebrationPage(progress);
                                }
                                else {
                                    ironmanLib.alert(res.message, 'alert-danger');
                                }
                            })
                    }
                    else {
                        const source = $('#startMemorizing-template').html();
                        const startMemorizingTmpl = Handlebars.compile(source);

                        contentElem.html(startMemorizingTmpl());
                        initStartMemorizingButton();
                    }
                }
                else if (result.errorCode == 108) {
                    inspectWordProgressToday();
                }
                else {
                    messageAlertElem.html(ironmanLib.alert(result.message, 'alert-danger'));
                }
            });
    }

    function inspectWordProgressToday() {
        $.getJSON('/exercises/words/inspect/progressToday')
            .done((result)=> {
                if (result.errorCode == 0) {
                    $('.calendar').calendar();

                    decorateCalendars();

                    const content = result.content;
                    if (content.length == 0) {
                        messageAlertElem.html(ironmanLib.alert('小朋友今天还没有背单词呢', 'alert-info'));
                    }
                    else {
                        showInspectionPage(content);
                    }
                }
            });
    }

    function decorateCalendars() {
        $.getJSON('/exercises/punching/recordsForParent')
            .done((result) => {
                if (result.errorCode == 0) {
                    let arrayOfPunchings = result.content;
                    if (arrayOfPunchings.length > 0) {

                    }
                }
            })
    }

    function showCalendars(arrayOfPunchings) {
        const source = $('#wordInspection-template').html();
        let inspectionTmpl = Handlebars.compile(source);
        let panels = Array();
        for (let item of arrayOfPunchings) {

        }
        let html = inspectionTmpl();
        $('panels').html(inspectionTmpl);

        for ((idx) in ) {
            showACalendar('#calendar_' + , )
        }
    }

    function showACalendar(calendarId, punchings) {
        let createdAts = punchings.map(punching => punching.createdAt);
        let momentStrings = createdAts.map(createdAt => moment(createdAt));

        $(calendarId).calendar({
            customDayRenderer: function (element, date) {
                var calendarMoment = moment(date);
                for (let str of momentStrings) {
                    let m = moment(str);
                    if (m.year() == calendarMoment.year()
                        && m.month() == calendarMoment.month()
                        && m.date() == calendarMoment.date()) {

                        $(element).css('background-color', 'red');
                        $(element).css('color', 'white');
                        $(element).css('border-radius', '15px');
                    }
                }
            }
        });

    }

    function showInspectionPage(content) {
        if (inspectionTmpl == undefined) {
            const source = $('#inspection-template').html();
            inspectionTmpl = Handlebars.compile(source);
        }

        const html = inspectionTmpl(content);
        contentElem.html(html);

        for (let [index, item] of content.entries()) {
            const html = htmlFromWordExercisProgresses(item.progresses, item.mail);
            $(`#progress_panel_${index}`).html(html);
        }
    }

    function initStartMemorizingButton() {
        $('button#startMemorizing').click(function () {
            $.getJSON('/exercises/words/wordExercisesForToday')
                .done(function (result) {
                    if (result.errorCode == 0) {
                        originalWordExerciseProgresses = result.content;
                        if (originalWordExerciseProgresses.length == 0) {
                            messageAlertElem.html(ironmanLib.alert('no more exercises', 'alert-warning'));
                        }
                        else {
                            startMemorizing();
                        }
                    }
                    else {
                        messageAlertElem.html(ironmanLib.alert(result.message, 'alert-danger'));
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