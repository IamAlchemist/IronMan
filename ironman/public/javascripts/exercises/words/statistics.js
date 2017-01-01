/**
 * Created by wizard on 23/12/2016.
 */

require(['../../libs/ironmanLib', 'http://cdn.bootcss.com/highcharts/5.0.6/highcharts.js'], function (ironmanLib, highCharts) {
    var messageElem;

    $(document).ready(function () {
        "use strict";
        messageElem = $('p#message');

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
    });

});
