var w = window.innerWidth,
    h = window.innerHeight;

var randomX = function(){
  return Math.floor(w * Math.random()) - 15;
};

var randomY = function(){
  return Math.floor(h * Math.random()) - 15;
};

var force = d3.layout.force()
    .linkDistance(2)
    .linkStrength(2)
    .gravity(.02)
    .charge(-10)
    .size([w, h]);

var nodes = force.nodes(),
    links = force.links();

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h);

droplets = d3.select('#chart svg');

var raindrops = droplets.selectAll('circle.raindrop')
    .data(d3.range(100)).enter().append('svg:circle')
    .style('fill','blue')
    .attr('class', 'raindrop')
    .attr('cx', function() { return randomX(); })
    .attr('cy', function() { return 20; })
    .attr('r', 15);


var drop = function(elements) {
  elements
      .attr('cx', function() { return randomX(); })
      .attr('cy', function() { return 20; })
      .transition()
      .ease('quad')
      .delay(function() { return Math.random() * 5000; })
      .duration(1500)
      .attr('cy', h)
      .each('end', function() { drop(d3.select(this)); });
};

drop(raindrops);

var path = svg.append("svg:path")
    .data([nodes]);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

force.on("tick", function() {
  path.attr("d", line);
});

var p0;

svg.on("mousemove", function() {
  // console.log(d3);
  // console.log(d3.svg);
  // console.log(d3.svg.mouse(this));
  var p1 = d3.svg.mouse(this),
      node = {x: p1[0], y: p1[1], px: (p0 || (p0 = p1))[0], py: p0[1]},
      link = {source: node, target: nodes[nodes.length - 1] || node};

  p0 = p1;
  if (nodes.length > 1) {
    node.fixed = true;
    nodes[nodes.length - 1].fixed = false;
  }

  d3.timer(function() {
    nodes.shift();
    links.shift();
    return true;
  }, 200);

  nodes.push(node);
  links.push(link);
  force.start();
});

// d3.timer(function(){
//   d3.selectAll('.raindrop')
//   .transition()
//   .ease('quad')
//   .attr('cy', h );
// }, 3000);



