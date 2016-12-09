/**
 * Created by wizard on 12/6/16.
 */
require(['../libs/ironmanLib'], function (ironmanLib) {
    let messageAlertElem;
    let panelsElem;
    let panelsTmpl;

    $(document).ready(()=> {
        messageAlertElem = $('#messageAlert');
        panelsElem = $('#panels');
        panelsTmpl = $('#calendars-template').html();

        let punchingType = panelsElem.attr("data");
        showHeatWithType(punchingType, panelsElem, panelsTmpl);
//            ironmanLib.showCalendarsWithType(punchingType, panelsElem, panelsTmpl);
    });

    function showHeatWithType(punchingType, elem, templ) {
        let url = "";
        if (punchingType == "homework") {
            url = '/exercises/punching/records/homework';
        }
        else if (punchingType == "word") {
            url = '/exercises/punching/records/word';
        }

        if (url.length != 0) {
            showHeatWithUrl(url, elem, templ);
        }
    }

    function showHeatWithUrl(url, elem, templ) {
        $.getJSON(url)
            .done((result) => {
                if (result.errorCode == 0) {
                    let arrayOfPunchings = result.content;
                    if (arrayOfPunchings.length > 0) {
                        showHeats(arrayOfPunchings, elem, templ);
                    }
                }
            })
    }

    function showHeats(arrayOfPunchings, elem, templ) {
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
        for (let i = 0; i < len; ++i) {
            showAHeat(`#calendar_${i}`, arrayOfPunchings[i])
        }
    }

    function showAHeat(elemId, punchings) {
        let createdAts = punchings.map(punching => punching.createdAt);
        let momentStrings = createdAts.map(createdAt => moment(createdAt));

        function contains(calendarMoment) {
            for (let str of momentStrings) {
                let m = moment(str);
                if (m.year() == calendarMoment.year()
                    && m.month() == calendarMoment.month()
                    && m.date() == calendarMoment.date()) {
                    return true;
                }
            }

            return false;
        }

        var now = moment().endOf('day').toDate();
        var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
        var chartData = d3.time.days(yearAgo, now).map(function (dateElement) {
            return {
                date: dateElement,
                count: contains(moment(dateElement)) ? 60 : 0
            };
        });

        var heatmap = calendarHeatmap()
            .data(chartData)
            .selector(elemId)
            .tooltipEnabled(true)
            .colorRange(['#f4f7f7', '#79a8a9'])
            .onClick(function (data) {
                console.log('data', data);
            });
        heatmap.months =
            heatmap();  // render the chart
    }

    function calendarHeatmap() {
        // defaults
        var width = 750;
        var height = 110;
        var legendWidth = 150;
        var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        var days = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var selector = 'body';
        var SQUARE_LENGTH = 11;
        var SQUARE_PADDING = 2;
        var MONTH_LABEL_PADDING = 6;
        var now = moment().endOf('day').toDate();
        var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
        var data = [];
        var colorRange = ['#D8E6E7', '#218380'];
        var tooltipEnabled = true;
        var tooltipUnit = 'contribution';
        var legendEnabled = true;
        var onClick = null;
        var weekStart = 0; //0 for Sunday, 1 for Monday

        // setters and getters
        chart.data = function (value) {
            if (!arguments.length) {
                return data;
            }
            data = value;
            return chart;
        };

        chart.selector = function (value) {
            if (!arguments.length) {
                return selector;
            }
            selector = value;
            return chart;
        };

        chart.colorRange = function (value) {
            if (!arguments.length) {
                return colorRange;
            }
            colorRange = value;
            return chart;
        };

        chart.tooltipEnabled = function (value) {
            if (!arguments.length) {
                return tooltipEnabled;
            }
            tooltipEnabled = value;
            return chart;
        };

        chart.tooltipUnit = function (value) {
            if (!arguments.length) {
                return tooltipUnit;
            }
            tooltipUnit = value;
            return chart;
        };

        chart.legendEnabled = function (value) {
            if (!arguments.length) {
                return legendEnabled;
            }
            legendEnabled = value;
            return chart;
        };

        chart.onClick = function (value) {
            if (!arguments.length) {
                return onClick();
            }
            onClick = value;
            return chart;
        };

        function chart() {
            d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove(); // remove the existing chart, if it exists

            var dateRange = d3.time.days(yearAgo, now); // generates an array of date objects within the specified range
            var monthRange = d3.time.months(moment(yearAgo).startOf('month').toDate(), now); // it ignores the first month if the 1st date is after the start of the month
            var firstDate = moment(dateRange[0]);
            var max = d3.max(chart.data(), function (d) {
                return d.count;
            }); // max data value

            // color range
            var color = d3.scale.linear()
                .range(chart.colorRange())
                .domain([0, max]);

            var tooltip;
            var dayRects;

            drawChart();

            function drawChart() {
                var svg = d3.select(chart.selector())
                    .append('svg')
                    .attr('width', width)
                    .attr('class', 'calendar-heatmap')
                    .attr('height', height)
                    .style('padding', '36px');

                dayRects = svg.selectAll('.day-cell')
                    .data(dateRange);  //  array of days for the last yr

                dayRects.enter().append('rect')
                    .attr('class', 'day-cell')
                    .attr('width', SQUARE_LENGTH)
                    .attr('height', SQUARE_LENGTH)
                    .attr('fill', function (d) {
                        return color(countForDate(d));
                    })
                    .attr('x', function (d, i) {
                        var cellDate = moment(d);
                        var result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
                        return result * (SQUARE_LENGTH + SQUARE_PADDING);
                    })
                    .attr('y', function (d, i) {
                        return MONTH_LABEL_PADDING + formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING);
                    });

                if (typeof onClick === 'function') {
                    dayRects.on('click', function (d) {
                        var count = countForDate(d);
                        onClick({date: d, count: count});
                    });
                }

                if (chart.tooltipEnabled()) {
                    dayRects.on('mouseover', function (d, i) {
                        tooltip = d3.select(chart.selector())
                            .append('div')
                            .attr('class', 'day-cell-tooltip')
                            .html(tooltipHTMLForDate(d))
                            .style('left', function () {
                                return Math.floor(i / 7) * SQUARE_LENGTH + 250 +'px';
                            })
                            .style('top', function () {
                                return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING) + MONTH_LABEL_PADDING * 3 + 270 + 'px';
                            });
                    })
                        .on('mouseout', function (d, i) {
                            tooltip.remove();
                        });
                }

                if (chart.legendEnabled()) {
                    var colorRange = [color(0)];
                    for (var i = 3; i > 0; i--) {
                        colorRange.push(color(max / i));
                    }

                    var legendGroup = svg.append('g');
                    legendGroup.selectAll('.calendar-heatmap-legend')
                        .data(colorRange)
                        .enter()
                        .append('rect')
                        .attr('class', 'calendar-heatmap-legend')
                        .attr('width', SQUARE_LENGTH)
                        .attr('height', SQUARE_LENGTH)
                        .attr('x', function (d, i) {
                            return (width - legendWidth) + (i + 1) * 13;
                        })
                        .attr('y', height + SQUARE_PADDING)
                        .attr('fill', function (d) {
                            return d;
                        });

                    legendGroup.append('text')
                        .attr('class', 'calendar-heatmap-legend-text')
                        .attr('x', width - legendWidth - 13)
                        .attr('y', height + SQUARE_LENGTH)
                        .text('Less');

                    legendGroup.append('text')
                        .attr('class', 'calendar-heatmap-legend-text')
                        .attr('x', (width - legendWidth + SQUARE_PADDING) + (colorRange.length + 1) * 13)
                        .attr('y', height + SQUARE_LENGTH)
                        .text('More');
                }

                dayRects.exit().remove();
                var monthLabels = svg.selectAll('.month')
                    .data(monthRange)
                    .enter().append('text')
                    .attr('class', 'month-name')
                    .style()
                    .text(function (d) {
                        return months[d.getMonth()];
                    })
                    .attr('x', function (d, i) {
                        var matchIndex = 0;
                        dateRange.find(function (element, index) {
                            matchIndex = index;
                            return moment(d).isSame(element, 'month') && moment(d).isSame(element, 'year');
                        });

                        return Math.floor(matchIndex / 7) * (SQUARE_LENGTH + SQUARE_PADDING);
                    })
                    .attr('y', 0);  // fix these to the top

                days.forEach(function (day, index) {
                    index = formatWeekday(index);
                    if (index % 2) {
                        svg.append('text')
                            .attr('class', 'day-initial')
                            .attr('transform', 'translate(-8,' + (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1) + ')')
                            .style('text-anchor', 'middle')
                            .attr('dy', '2')
                            .text(day);
                    }
                });
            }

            function tooltipHTMLForDate(d) {
                var dateStr = moment(d).locale('zh-cn').format('LL');
                var count = countForDate(d);
                return '<span>' + dateStr + '</span>';
            }

            function countForDate(d) {
                var count = 0;
                var match = chart.data().find(function (element, index) {
                    return moment(element.date).isSame(d, 'day');
                });
                if (match) {
                    count = match.count;
                }
                return count;
            }

            function formatWeekday(weekDay) {
                if (weekStart === 1) {
                    if (weekDay === 0) {
                        return 6;
                    } else {
                        return weekDay - 1;
                    }
                }
                return weekDay;
            }

            var daysOfChart = chart.data().map(function (day) {
                return day.date.toDateString();
            });

            dayRects.filter(function (d) {
                return daysOfChart.indexOf(d.toDateString()) > -1;
            }).attr('fill', function (d, i) {
                return color(chart.data()[i].count);
            });
        }

        return chart;
    }


    // polyfill for Array.find() method
    /* jshint ignore:start */
    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }
    /* Jshint Ignore:End */

});