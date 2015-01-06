(function() {
    'use strict';

    var years = [ 2009, 2010, 2011, 2012, 2013 ];
    var incomes = {
        'Inntekter': {
            'Skatter': [ 479660, 533621, 594938, 618816, 598671 ],
            'Avgifter': [ 286614, 307922, 319746, 333554, 350197 ],
            'Kapitalskatter': [ 2431, 2377, 1754, 1887, 2246 ],
            'Trygde- og pensjonspremier': [ 233433, 243329, 259012, 277015, 292024 ],
            'Formuesinntekter': {
                'Renteinntekter': [ 93935, 86128, 89840, 81558, 85445 ],
                'Utbytte': [ 74987, 70332, 95146, 101929, 113897 ],
                'Uttak fra forretningsdrift': [ 99887, 101740, 127408, 150764, 133411 ],
                'Bompenger, leieinntekter av naturressurser mv': [ 8874, 7585, 9066, 11496, 12147 ]
            },
            'Betalinger for offentlige tjenester mv.': [ 66130, 71404, 74937, 78962, 82133 ],
            'Løpende overføringer': {
                'Bøter, inndragninger mv.': [ 1732, 2152, 2015, 1978, 1951 ],
                'Andre innenlandske overføringer': [ 6306, 6642, 6726, 6679, 7158 ]
            },
            'Overføringer fra utlandet': [ 138, 52, 7, 39, 47 ]
        }
    };
    var expenses = {
        'Løpende utgifter': {
            'Lønnskostnader': [ 322659, 340251, 362193, 384823, 406746 ],
            'Kjøp av varer og tjenester': [ 144266, 151004, 155097, 159799, 169684 ],
            'Kapitalslit (ifm. løpende utgifter)': [ 68755, 73589, 79448, 86704, 91532 ],
            'Formuesutgifter': {
                'Renteutgifter': [ 36165, 32029, 31590, 26534, 25744 ],
                'Leie av tomter og grunn': [ 4, 4, 4, 6, 4 ]
            },
            'Stønader i naturalia (produktkjøp til husholdninger)': [ 51704, 56137, 58131, 60942, 62779 ],
            'Stønader i kontanter til husholdninger': [ 326722, 345532, 367100, 386778, 404427 ],
            'Subsidier': [ 49311, 52383, 53311, 55603, 58042 ],
            'Løpende overføringer': {
                'Overføringer til ideelle organisasjoner': [ 29813, 30306, 31737, 33378, 36663 ],
                'Andre innenlandske overføringer': [ 1709, 1826, 2057, 2193, 2277 ],
                'Overføringer til utlandet': [ 27292, 29829, 28696, 27838, 32087 ]
            },
            'Kapitaloverføringer': {
                'Innenlandske kapitaloverføringer': [ 3472, 2740, 3302, 2877, 2967 ],
                'Kapitaloverføringer til utlandet': [ 1120, 1268, 1500, 1280, 1377 ]
            }
        }
    };
    
    function reorg(data, nodes, links, yearIndex, reverse) {
        function _reorg(data, parentIndex) {
            return _.chain(data).pairs().map(function(pair) {
                var index = nodes.length, sum;
                nodes.push({ name: pair[0] });
                if (_.isArray(pair[1])) {
                    sum = pair[1][yearIndex];
                } else {
                    sum = _reorg(pair[1], index);
                }
                if (parentIndex >= 0 ) {
                    if (reverse) links.push({ source: parentIndex, target: index, value: sum });
                    else links.push({ source: index, target: parentIndex, value: sum });
                }
                return sum;
            }).reduce(function(sum, v) { return sum + v; }, 0).value();
        };
        return _reorg(data, -1);
    }

    function join(left, right, nodes, links, yearIndex) {
        reorg(right, nodes, links, 4, true);
        var index = nodes.length;
        reorg(left, nodes, links, 4, false);
        function sum(a, b) { return a + b; }
        links.push({ source: index, target: 0, value: _.chain(links).filter(function(link) { return link.source == 0; }).pluck('value').reduce(sum).value() });
    }

    var nodes = [], links = [];
    join(incomes, expenses, nodes, links, 4);
    
//    var nodes = _.map(["a", "b", "c", "d", "e", "f"], function(o) { return { name: o }; });
//    var links = _.map([[3, 4, 2], [0, 1, 5], [1, 3, 2], [1, 2, 3], [4, 5, 2]], function(o) { return { source: o[0], target: o[1], value: o[2] } });
    
    //nodes = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    //links = [{ source: 0, target: 1, value: 50 }, { source: 0, target: 2, value: 100 }];
    console.log(nodes);
    console.log(links);

    var margin = {top: 1, right: 1, bottom: 6, left: 1},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),
        format = function(d) { return formatNumber(d) + " million kroner"; },
        color = d3.scale.category20();

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    var path = sankey.link();

    sankey
        .nodes(nodes)
        .links(links)
        .layout(32);

    var link = svg.append("g").selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
      .text(function(d) { return d.source.name + " > " + d.target.name + "\n" + format(d.value); });

    var node = svg.append("g").selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

    node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    function dragmove(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
})();
