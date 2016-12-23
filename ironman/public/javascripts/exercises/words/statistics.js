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
                    showPieChart(nodeId, dataSets[i]);
                }
            });
    });

    function showPieChart(nodeId, data) {
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };

        var title = {
            text: `${data.mail}掌握单词比例`
        };

        var tooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };

        var plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}%, 共计: {point.y}个',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        };

        var series = [{
            type: 'pie',
            name: '比例',
            data: data.data
        }];

        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;

        $(nodeId).highcharts(json);
    }
});
