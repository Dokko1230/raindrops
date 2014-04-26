// console.log("test");

var width = 800;
var height = 800;

var svg = d3.select("body").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

var nodes = [],
    links = [];

var a = {id: "a", fixed: true}, b = {id: "b"};
nodes.push(a,b);
links.push({source: a, target: b});

var force = d3.layout.force()
    .gravity(0.2)
    .size([width/2, height/2])
    .nodes(nodes)
    .linkStrength(2)
    .links(links)
    .on('tick', tick)
    .start();

// var links = d3.layout.tree().links(nodes);

var link = svg.selectAll('line')
              .data(links)
              .enter()
              .insert('line', '.link')
              //.insert('svg:line')
              .attr('fill', 'red')
              .attr('class', 'link');

var node = svg.selectAll('circle.node')
              .data(nodes)
              .enter()
              .append('svg:circle')
              .attr('r', 8)
              // .attr('cx', function(d) { return d.x; })
              // .attr('cy', function(d) { return d.y; })
              .attr('class', 'node')
              .call(force.drag);

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}


console.log(node);
