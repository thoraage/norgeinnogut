var years = [ 2009, 2010, 2011, 2012, 2013 ];
var data = {
    Inntekter: {
        'Skatt på inntekt og formue': [ 347591, 393412, 460617, 471087, 433139 ],
        'Avgifter (produksjonsskatter)': [ 276365, 296919, 308527, 322389, 337948 ],
        'Kapitalskatter': [ 2431, 2377, 1754, 1887, 2246 ],
        'Trygde og pensjonspremier': [ 234864, 244330, 261263, 278820, 292782 ],
        'Formuesinntekter': {
            'Renteinntekter': [ 86548, 81951, 83295, 75650, 80029 ],
            'Utbytte': [ 69526, 65110, 86410, 96416, 108386 ],
            'Uttak fra forretningsdrift': {
                'Uttak fra sdøe': [ 98285, 100258, 125820, 148446, 131604 ],
                'Uttak fra annen virksomhet': [ 14, 6, 12, -14, -2]
            },
            'Bompenger, leieinntekter av grunn mv': [ 7335, 4619, 4877, 7031, 8794 ]
        },
        'Gebyrinntekter': [ 21164, 23033, 23594, 24705, 25276 ],
        'Løpende overføringer': {
            'Overføringer fra offentlig forvaltning': {
                'Overføringer fra kommuneforvaltningen': [ 2269, 1474, 1262, 6848, 7285 ]
            },
            'Bøter, inndragninger mv.': [ 1732, 2152, 2015, 1978, 1938 ],
            'Andre innenlandske overføringer': [ 1808, 1731, 2013, 1909, 1618 ],
            'Overføringer fra utlandet': [ 138, 52, 7, 39, 46 ]
        }
    }
};

function reorg(data, nodes, links, yearIndex) {
    return reorg2(data, nodes, links, -1, yearIndex) 
}
function reorg2(data, nodes, links, parentIndex, yearIndex) {
    'use strict';
    return _.chain(data).pairs().map(function(pair) {
        var index = nodes.length;
        nodes.push({ name: pair[0] });
        var sum;
        if (_.isArray(pair[1])) {
            sum = pair[1][yearIndex];
        } else {
            sum = reorg2(pair[1], nodes, links, index, yearIndex);
        }
        if (parentIndex >= 0 ) {
            links.push({ source: parentIndex, target: index, value: sum });
        }
        return sum;
    }).reduce(function(sum, v) { return sum + v; }, 0).value();
}

var nodes = [];
var links = [];
reorg(data, nodes, links, 4);

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
