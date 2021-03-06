// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+              
// |V|A|S|T| |C|H|A|L|L|E|N|G|E| |2|0|1|7|              
// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+              
// PETER VAN TWUYVER, 10872809
// MINOR PROGRAMMEREN UVA 2017
// +-+-+-+-+ +-+-+-+-+-+-+-+-+-+ +-+-+-+-+  
// CalendarView based on code from M. Bostock: https://bl.ocks.org/mbostock/4063318
// Linechart based on code from M. Bostock: https://bl.ocks.org/mbostock/3884955
// Barchart based on code from https://bl.ocks.org/DimsumPanda/689368252f55179e12185e13c5ed1fee
window.onload = function() {
    getOption();
};
// get user selection and select appropriate functions to draw svg's
function getOption() {
    var obj = document.getElementById("mySelect");
    // clear all previous subcalendars
    var sub = d3.select('#subcalendar')
    sub.selectAll("div").remove();

    if (obj.value == "Rangerbase") {
        // change map image
        document.getElementById('myImage').src = 'data/Lekagul_map_base.jpg'
        // get data for calendars from appropriate csv-file
        showData("data/all_ranger-bases.csv", "Ranger Base");
        // provide drwaLinechart with appropriate tsv-file
        drawLinechart("data/yeartraffic_rangerbase.tsv");
        // update titel barchart
        document.getElementById("demo").innerHTML = "24 Hour traffic at Rangerbase";
        // type-calendars info:
        var all_types = ['rangerbase'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Rangerstops") {
        document.getElementById('myImage').src = 'data/Lekagul_map_rangerstops.jpg'
        drawLinechart("data/yeartraffic_rangerstops.tsv");
        showData("data/all_ranger-stops.csv", "Ranger Stops");
        document.getElementById("demo").innerHTML = "24 Hour traffic at selected Rangerstops";
        var all_types = ['rangerstop0', 'rangerstop1', 'rangerstop2', 'rangerstop3', 'rangerstop4', 'rangerstop5', 'rangerstop6', 'rangerstop7'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Generalgates") {
        document.getElementById('myImage').src = 'data/Lekagul_map_general.jpg'
        drawLinechart("data/yeartraffic_general_gates.tsv");
        showData("data/all_general-gates.csv", "General Gates");
        document.getElementById("demo").innerHTML = "24 Hour traffic at selected General gate";
        var all_types = ['generalgate0', 'generalgate1', 'generalgate2', 'generalgate3', 'generalgate4', 'generalgate5', 'generalgate6', 'generalgate7'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Gates") {
        document.getElementById('myImage').src = 'data/Lekagul_map_gates.jpg'
        drawLinechart("data/yeartraffic_gates.tsv");
        showData("data/all_gates.csv", "All Gates");
        document.getElementById("demo").innerHTML = "24 Hour traffic at selected Gate";
        var all_types = ['gate0', 'gate1', 'gate2', 'gate3', 'gate4', 'gate5', 'gate6', 'gate7', 'gate8'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Campsites") {
        document.getElementById('myImage').src = 'data/Lekagul_map_campings.jpg'
        drawLinechart("data/yeartraffic_camps.tsv");
        showData("data/all_campings.csv", "Campsites");
        document.getElementById("demo").innerHTML = "24 Hour traffic at selected Camping";
        var all_types = ['camping0', 'camping1', 'camping2', 'camping3', 'camping4', 'camping5', 'camping6', 'camping7', 'camping8'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Entrances") {
        document.getElementById('myImage').src = 'data/Lekagul_map_entrances.jpg'
        drawLinechart("data/yeartraffic_entrances.tsv");
        showData("data/all_entrances.csv", "Entrances");
        document.getElementById("demo").innerHTML = "24 Hour traffic at selected Entrance";
        var all_types = ['entrance0', 'entrance1', 'entrance2', 'entrance3', 'entrance4'];
        all_types.forEach(function(item) {
            drawLocations(item);
        });
    }
    if (obj.value == "Total") {
        document.getElementById('myImage').src = 'data/Lekagul_map.jpg'
        drawLinechart("data/yeartraffic_park.tsv");
        showData("data/busyness_by_type.csv", "Total Park");
        // data for type-calendars
        var all_types = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Ranger'];
        all_types.forEach(function(item) {
            drawType(item);
        });
    }
}
// bind data for calendar based on selected csv file 
function showData(csv_file_name, location) {
    d3.csv(csv_file_name, function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) {
                return d.Day;
            })
            .rollup(function(v) {
                return d3.sum(v, function(d) {
                    return d.Total;
                });
            })
            .object(csv);
        drawTotalCalendar(data, location);
    });
}
// draw the main calendar
function drawTotalCalendar(cal_data, location) {
    var width = 650,
        height = 100,
        cellSize = 10;
    // set colorgradient for min/max values
    var max = d3.max(d3.values(cal_data));
    var min = d3.min(d3.values(cal_data));

    var color = d3.scaleLinear()
        .domain([min, max])
        .range(["#fee0d2", "#de2d26"]);
    // Root SVG objects within #calendar div
    var cal = d3.select("#calendar")
        .selectAll("svg")
        .data(d3.range(2015, 2017)); // range of years

    // remove old data in calendar
    cal.exit().remove();

    var svg = cal.enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text("TOTAL");

    var rectSelect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(year) {
            return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));
        });
    var rect = rectSelect
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {
            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        .on('click', function(rect_date) {
            drawDateline(rect_date);
        })
        .append('title');
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 42) + 8) + ",0)";
        });
    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    d3.select("#calendar").selectAll("rect")
        .attr("fill", function(d) {

            if (d in cal_data) {
                return color(cal_data[d]);
            } else {
                return "grey";
            }
        })
        .select("title")
        .text(function(d) {
            if (d in cal_data) {
                return d + ": " + cal_data[d];
            } else {
                return "No data";
            }
        });
    // create visual line separating months
    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};
// draws the sub-calendars for Types
function drawType(which_type) {
    var width = 460,
        height = 100,
        cellSize = 8;

    var root = d3.select('#subcalendar').append('div');
    var svg = root
        .selectAll("svg")
        .data(d3.range(2015, 2017))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .text(which_type);

    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {

            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        //24H barchart not available for TYPE's
        .on('click', function(rect_date) {
            drawDateline(rect_date);
            // clear any previous bars in barchart
            var bars = d3.select("#barchart").select("g").selectAll("rect");
            bars.remove();
            document.getElementById("demo").innerHTML = "No 24 Hour traffic data available for car-type";
        });

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);

    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 34) + 8) + ",0)";
        });

    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    d3.csv("data/busyness_by_type.csv", function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) {

                return d.Day;
            })
            .rollup(function(d) {
                return parseInt(d[0][which_type])
            })
            .object(csv);

        // set colorgradient for min/max values
        var max = d3.max(d3.values(data));
        var min = d3.min(d3.values(data));

        svg.append("text")
            .style("text-anchor", "start")
            .attr("font-size", 12)
            .attr("stroke", "#de2d26")
            .attr("dy", -18)
            .attr("dx", " -.25em")
            .text("Range: " + min + "-" + max);
        var color = d3.scaleLinear()
            .domain([min, max])
            .range(["white", "#de2d26"]);

        rect.filter(function(d) {
                return d in data;
            })
            .attr("fill", function(d) {
                return color(data[d]);
            })
            .append("title")
            .text(function(d) {
                return d + ": " + data[d];
            });
    });

    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};

// draws the sub-calendars for Locations
function drawLocations(which_location) {

    var width = 460,
        height = 100,
        cellSize = 8;

    var root = d3.select('#subcalendar').append('div');

    var svg = root
        .selectAll("svg")
        .data(d3.range(2015, 2017))
        .enter().append("svg")
        // add class to svg based on location
        .attr("class", which_location)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .text(which_location);

    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function(d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function(d) {
            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%d/%m/%Y"))
        // get location and date when clicked
        .on('click', function(rect_date) {
            onRectClicked(which_location, rect_date);
            drawDateline(rect_date)
        });

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function(d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 34) + 8) + ",0)";
        });

    legend.append("text")
        .attr("class", function(d, i) {
            return month[i]
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i]
        });

    d3.csv("data/busylocations.csv", function(error, csv) {
        if (error) throw error;

        var data = d3.nest()
            .key(function(d) {

                if (d.Day.length == 8) {
                    return d.Day.substring(0, 6) + "20" + d.Day.substring(6, 8);
                }
                return d.Day;
            })
            .rollup(function(d) {

                return parseInt(d[0][which_location])
            })
            .object(csv);

        // set colorgradient for min/max values
        var max = d3.max(d3.values(data));
        var min = d3.min(d3.values(data));

        svg.append("text")
            .style("text-anchor", "start")
            .attr("font-size", 12)
            .attr("stroke", "#de2d26")
            .attr("dy", -18)
            .attr("dx", " 0em")
            .text("Range: " + min + "-" + max);
        var color = d3.scaleLinear()
            .domain([min, max])
            .range(["white", "#de2d26"]);

        rect.filter(function(d) {
                return d in data;
            })
            .attr("fill", function(d) {
                return color(data[d]);
            })
            // create pointer to indicate clickable content
            .style("cursor", "pointer")
            .append("title")
            .text(function(d) {
                return d + ": " + data[d];
            })

    });

    function pathMonth(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = t0.getDay(),
            w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
            d1 = t1.getDay(),
            w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
};
// set up linechart svg and clean previous
var setupGraph = function() {
    var svg = d3.select("svg");
    svg.selectAll("*").remove();
    return svg;
}

function drawLinechart(linechart_file) {

    var svg = setupGraph();
    svg = d3.select("#linechart").select("svg"),

        margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#linechart").select("svg").exit().remove();

    var parseTime = d3.timeParse("%d-%m-%Y");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal()
        .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#black"]);

    var line = d3.line()
        .curve(d3.curveStepBefore)
        .x(function(d) {
            return x(d.Day);
        })
        .y(function(d) {
            return y(d.vehicles);
        });
    // read the data from file
    d3.tsv(linechart_file, type, function(error, data) {
        if (error) throw error;

        var types = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {
                        Day: d.Day,
                        vehicles: d[id]
                    };
                })
            };
        });

        x.domain(d3.extent(data, function(d) {
            return d.Day;
        }));

        y.domain([
            d3.min(types, function(c) {
                return d3.min(c.values, function(d) {
                    return d.vehicles;
                });
            }),
            d3.max(types, function(c) {
                return d3.max(c.values, function(d) {
                    return d.vehicles;
                });
            })
        ]);

        z.domain(types.map(function(c) {
            return c.id;
        }));

        var x_axis = g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y_axis = g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Unique vehicles");

        var type = g.selectAll(".type")
            .data(types)
            .enter().append("g")
            .attr("class", "type");

        type.append("path")
            .attr("class", "line")
            .attr("d", function(d) {
                return line(d.values);
            })
            .style("stroke", function(d) {
                return z(d.id);
            });

        type.append("text")
            .datum(function(d) {
                return {
                    id: d.id,
                    value: d.values[d.values.length - 1]
                };
            })
            .attr("transform", function(d) {
                return "translate(" + x(d.value.Day) + "," + y(d.value.vehicles) + ")";
            })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function(d) {
                return d.id;
            });

        // Mouseover function
        var mouseG = svg.append("g")
            .attr("class", "mouse-over-effects")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // black vertical line to follow mouse
        mouseG.append("path")
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opatemp", "0");
        var lines = document.getElementsByClassName('line');
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(types)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");
        mousePerLine.append("circle")
            .attr("r", 3)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opatemp", "0");
        mousePerLine.append("text")
            .attr("transform", "translate(10,3)");
        // append a rect to catch mouse movements on canvas    
        mouseG.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            // on mouse-out hide line, circles and text
            .on('mouseout', function() {
                d3.select(".mouse-line")
                    .style("opatemp", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opatemp", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opatemp", "0");
            })
            // on mouse-in show line, circles and text
            .on('mouseover', function() {
                d3.select(".mouse-line")
                    .style("opatemp", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opatemp", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opatemp", "1");
            })
            // mouse moving over canvas
            .on('mousemove', function() {
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function() {
                        var d = "M" + mouse[0] + "," + height;
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });
                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d, i) {
                        var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function(d) {
                                return d.date;
                            }).right;
                        idx = bisect(d.values, xDate);
                        var beginning = 0,
                            end = lines[i].getTotalLength(),
                            target = null;
                        while (true) {
                            target = Math.floor((beginning + end) / 2);
                            pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0]) end = target;
                            else if (pos.x < mouse[0]) beginning = target;
                            else break;
                        }
                        d3.select(this).select('text')
                            .text(y.invert(pos.y).toFixed(2));
                        return "translate(" + mouse[0] + "," + pos.y + ")";
                    });
            });
    });

    function type(d, _, columns) {
        d.Day = parseTime(d.Day);
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }

};
// when clicked on calendar date
function onRectClicked(location, date) {
    // provide barchart with correct datafile and date
    drawBarchart("data/sensor_data_" + location + ".json", date);
}

function plotBarchart(data, types, date) {
    var margin = {
        top: 20,
        right: 160,
        bottom: 35,
        left: 30
    };

    // create stack of car-types based on the Types
    var series = d3.stack()
        .keys(types)
        .offset(d3.stackOffsetDiverging)
        (data);

    var svg = d3.select("#barchart").select("svg"),
        margin = {
            top: 20,
            right: 30,
            bottom: 50,
            left: 60
        },
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var x = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.time;
        }))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
        .rangeRound([height - margin.bottom, margin.top]);
    // same colors as types in linechart
    var z = z = d3.scaleOrdinal()
        .range(["#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"]);

    svg.selectAll("*").remove();

    // no update when no data in rect
    if (data.length < 1) {
        return;
    }

    svg.append("g")
        .selectAll("g")
        .data(series)
        .enter().append("g")
        .attr("fill", function(d) {
            return z(d.key);
        })
        .selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("width", x.bandwidth)
        .attr("x", function(d) {
            return x(d.data.time);
        })
        .attr("y", function(d) {
            return y(d[1]);
        })
        .attr("height", function(d) {
            return y(d[0]) - y(d[1]);
        })

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(
            d3.axisLeft(y)
        );

    svg.append("text")
        .attr("x", width - 400)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(date);

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(types)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) {
            return d;
        });
    legend.append("text")
        .attr("x", width - 40)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text("Car-type");


    function stackMin(serie) {
        return d3.min(serie, function(d) {
            return d[0];
        });
    }

    function stackMax(serie) {
        return d3.max(serie, function(d) {
            return d[1];
        });
    }

}

function drawBarchart(filename, date) {
    d3.json(filename, function(error, data) {

        // create  dict with all empty timeslots
        var fullday = {
            "01:00": 0,
            "02:00": 0,
            "03:00": 0,
            "04:00": 0,
            "05:00": 0,
            "06:00": 0,
            "07:00": 0,
            "08:00": 0,
            "09:00": 0,
            "10:00": 0,
            "11:00": 0,
            "12:00": 0,
            "13:00": 0,
            "14:00": 0,
            "15:00": 0,
            "16:00": 0,
            "17:00": 0,
            "18:00": 0,
            "19:00": 0,
            "20:00": 0,
            "21:00": 0,
            "22:00": 0,
            "23:00": 0,
            "00:00": 0
        }

        // only look at entries on selected date
        var day_data = data[date];

        // fill the timeslots with data if present
        Object.keys(day_data).forEach(function(d) {
            fullday[d] = Object.values(day_data[d])
        });

        // create new list of entries for this data summed per type
        var new_data = [];

        // keep track of all types found 
        var types_Dict = {};
        for (var time in fullday) {
            var hour_data = fullday[time];
            var new_hour_data = {
                "time": time
            };

            for (var entry_id in hour_data) {
                var entry = hour_data[entry_id];
                var entry_type = entry["car-type"];
                // count cartypes in types Dict:
                // check if car type alread found for this timeslot
                if (!(entry_type in new_hour_data)) {
                    // not found so set to 1
                    new_hour_data[entry_type] = 1;
                    if (!(entry_type in types_Dict)) {
                        types_Dict[entry_type] = 1;
                    }
                } else {
                    // already found so increase the value
                    new_hour_data[entry_type] += 1;
                }

            };
            new_data.push(new_hour_data);
        };

        var all_types = Object.keys(types_Dict);
        // set all known car-types to zero
        // if no entry found to prevent warnings
        // later in plot function
        all_types.forEach(function(type) {
            new_data.forEach(function(time_data) {
                if (!(type in time_data)) {
                    time_data[type] = 0;
                }
            })
        });

        plotBarchart(new_data, all_types, date);

    })
}
// get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// get the DIV with overlay effect on small screens
var overlayBg = document.getElementById("myOverlay");

// toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
    if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
    } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
    }
}

// close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}

function drawDateline(date) {

    var line = d3.select("#linechart").select("svg").selectAll("line");
    line.remove();
    var label = d3.select("#linechart").select("svg").selectAll(".date_label");
    label.remove();

    // correct for width difference between SVG and Rect
    var width_difference = 48;

    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    // use date-calculation code from http://www.mattkruse.com/ 
    // in date.js
    var date1 = getDateFromFormat("01/05/2015", "d/M/y");
    var date2 = getDateFromFormat(date, "d/M/y");

    var diff_date = Math.round((date2 - date1) / days);

    //draw line at the selected date
    var x_date = ((680 - width_difference) / 397) * (diff_date + 1)

    var svg = d3.select("#linechart").select("svg");

    svg.append("line")
        .attr("x1", x_date + width_difference)
        .attr("y1", 18)
        .attr("x2", x_date + width_difference)
        .attr("y2", 465)
        .attr("stroke-width", 1.5)
        .attr("stroke", "#000");

    var date_label = svg.append("text")
        .attr("y", 0)
        .attr("class", "date_label")
        .attr("x", x_date)
        .attr("dy", "1em")
        .attr("fill", "#000")
        .text(date);

    margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
    };
    var x = d3.scaleTime().range([0, 630])
}

// get the input from radio buttons
function changeColour(value) {
    var color = document.body.style.backgroundColor;
    switch (value) {
        case 'g':
            color = "lightgrey";
            break;
        case 's':
            color = "whitesmoke";
            break;
        case 'w':
            color = "white";
            break;
    }
    document.body.style.backgroundColor = color;
}