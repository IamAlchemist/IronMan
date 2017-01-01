/**
 * Created by wizard on 12/6/16.
 */
require(['../../libs/ironmanLib', 'http://cdn.bootcss.com/highcharts/5.0.6/highcharts.js'], function (ironmanLib, highCharts) {
    let messageAlertElem;
    let panelsElem;
    let panelsTmpl;

    $(document).ready(()=> {
        messageAlertElem = $('#messageAlert');
        panelsElem = $('#panels');
        panelsTmpl = $('#calendars-template').html();

        let punchingType = panelsElem.attr("data");
        ironmanLib.showHeatWithType(punchingType, panelsElem, panelsTmpl);

        showStatistics();
    });

    function showStatistics() {
        $.getJSON('/api/words/statistics')
            .done((result)=> {
                const elem = $('#pieChart');
                const dataSets = result.content;
                let html = "";
                for (let i = 0; i < dataSets.length; ++i) {
                    html += `<div id="pieChart_${i}"></div>`
                }

                elem.html(html);

                for (let i = 0; i < dataSets.length; ++i) {
                    let nodeId = `#pieChart_${i}`;
                    ironmanLib.showPieChart(nodeId, dataSets[i]);
                }
            });
    }


});