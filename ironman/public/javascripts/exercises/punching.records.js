/**
 * Created by wizard on 12/6/16.
 */
require(['../libs/ironmanLib', 'http://cdn.bootcss.com/moment.js/2.17.0/moment.min.js'], function (ironmanLib, moment) {
    let messageAlertElem;
    let panelsElem;
    let panelsTmpl;

    $(document).ready(()=>{
        messageAlertElem = $('#messageAlert');
        panelsElem = $('#panels');
        panelsTmpl = $('#calendars-template').html();

        let punchingType = panelsElem.attr("data");
        showCalendarsWithType(punchingType);
    });

    function showCalendarsWithType(punchingType) {
        if (punchingType == "homework") {
            $.getJSON('/exercises/punching/records/homework')
                .done((result) => {
                    if (result.errorCode == 0) {
                        let arrayOfPunchings = result.content;
                        if (arrayOfPunchings.length > 0) {
                            showCalendars(arrayOfPunchings);
                        }
                    }
                })
        }
        else if (punchingType == "word") {

        }
    }

    function showCalendars(arrayOfPunchings) {
        let template = Handlebars.compile(panelsTmpl);
        let panelTitles = Array();
        for (let item of arrayOfPunchings) {
            if (item.length > 0) {
                let punching = item[0];
                let title = punching.mail;
                panelTitles.push(title);
            }
        }
        let html = template(panelTitles);
        panelsElem.html(html);

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

});