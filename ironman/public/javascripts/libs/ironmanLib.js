/**
 * Created by wizard on 11/1/16.
 */

define(['http://cdn.bootcss.com/moment.js/2.17.0/moment.min.js'], function (moment) {
    var add = function (x, y) {
        return x + y;
    };

    function setupForm(jqElem, callback) {

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

    function decorateRadioInputs(callback) {
        var inputs = $('input[type=radio]');
        inputs.iCheck({
            radioClass: 'iradio_square-green',
            increaseArea: '20%'
        });

        inputs.on('ifChecked', function (event) {
            if (callback != undefined) {
                callback(event.target.id);
            }
            else {
                console.log(event.target.id);
            }
        });
    }

    function alert(message, className) {
        return `<div class="alert ${className} alert-dismissible" role="alert">
                  <button type="button" class="close" data-dismiss="alert">
                      <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                  </button>
                  ${message}
                </div>`;
    }

    function getMessageFromJson(json) {
        return json.content != undefined && json.content.message != undefined ?
            json.content.message : json.message;
    }

    function showCalendarsWithType(punchingType, elem, templ) {
        let url = "";
        if (punchingType == "homework") {
            url = '/exercises/punching/records/homework';
        }
        else if (punchingType == "word") {
            url = '/exercises/punching/records/word';
        }

        if (url.length != 0) {
            showCalendarWithURL(url, elem, templ);
        }
    }

    function showCalendarWithURL(url, elem, templ) {
        $.getJSON(url)
            .done((result) => {
                if (result.errorCode == 0) {
                    let arrayOfPunchings = result.content;
                    if (arrayOfPunchings.length > 0) {
                        showCalendars(arrayOfPunchings, elem, templ);
                    }
                }
            })
    }

    function showCalendars(arrayOfPunchings, elem, templ) {
        let template = Handlebars.compile(templ);
        let panelTitles = Array();
        for (let item of arrayOfPunchings) {
            if (item.length > 0) {
                let punching = item[0];
                let title = punching.mail;
                panelTitles.push(title);
            }
        }
        let html = template(panelTitles);
        elem.html(html);

        const len = arrayOfPunchings.length;
        for (let i = 0; i < len; ++i ) {
            showACalendar(`#calendar_${i}`, arrayOfPunchings[i])
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


    return {
        add: add,
        alert: alert,
        setupForm: setupForm,
        decorateRadioInputs: decorateRadioInputs,
        getMessageFromJson: getMessageFromJson,
        showCalendarsWithType: showCalendarsWithType
    };
});