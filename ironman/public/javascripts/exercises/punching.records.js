/**
 * Created by wizard on 12/6/16.
 */
require(['../libs/ironmanLib'], function (ironmanLib) {
    let messageAlertElem;
    let panelsElem;
    let panelsTmpl;

    $(document).ready(()=>{
        messageAlertElem = $('#messageAlert');
        panelsElem = $('#panels');
        panelsTmpl = $('#calendars-template').html();

        let punchingType = panelsElem.attr("data");
        ironmanLib.showCalendarsWithType(punchingType, panelsElem, panelsTmpl);
    });
});