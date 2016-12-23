/**
 * Created by wizard on 23/12/2016.
 */

require(['../../libs/ironmanLib', 'http://cdn.bootcss.com/highcharts/5.0.6/highcharts.js'], function (ironmanLib, highCharts) {
    var messageElem;

    $(document).ready(function () {
        "use strict";
        messageElem = $('p#message');

        $.getJSON('/api/words/statistics')
            .done((data)=> {
                console.log(JSON.stringify(data));
            });

        let data = [
            ['Firefox', 45.0],
            ['IE', 26.8],
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Safari', 8.5],
            ['Opera', 6.2],
            ['Others', 0.7]
        ];
        showPieChart(data);
    });

    function showPieChart(data) {
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };

        var title = {
            text: '掌握单词比例'
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
                    format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        };

        var series = [{
            type: 'pie',
            name: '掌握单词比例',
            data: data
        }];

        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;

        $('#pieChart').highcharts(json);
    }
});
