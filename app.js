var settings = {
  offsetX: 25,
  droplets: 130,
  speed: 1500,
  w: window.innerWidth,
  h: window.innerHeight,
  dropletWidth: 30,
  dropletHeight: 30
};

var randomX = function(){
  return Math.floor(settings.w * Math.random()) - 15;
};

var randomY = function(){
  return Math.floor(settings.h * Math.random()) - 15;
};

var force = d3.layout.force()
    .linkDistance(2)
    .linkStrength(2)
    .gravity(.02)
    .charge(-10)
    .size([settings.w, settings.h]);

var nodes = force.nodes(),
    links = force.links();

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", settings.w)
    .attr("height", settings.h)
    .attr('class','board');

// svg.append("svg:rect")
//     .attr("width", w)
//     .attr("height", h);

droplets = d3.select('#chart svg');


// nodeEnter.append("svg:image")
//    .attr('x',-9)
//    .attr('y',-12)
//    .attr('width', 20)
//    .attr('height', 24)
//    .attr("xlink:href","resources/images/check.png")

var raindrops = droplets.selectAll('circle.raindrop')
    .data(d3.range(settings.droplets)).enter().append('svg:image')
    //.style('fill','blue')
    .attr('class', 'raindrop')
    .attr('x', function() { return randomX(); })
    .attr('y', function() { return -40; })
    .attr('width', settings.dropletWidth)
    .attr('height', settings.dropletHeight)
    .attr('xlink:href','img/boom.png');


var drop = function(elements) {
  elements
      .attr('x', function() { return randomX(); })
      .attr('y', function() { return -40; })
      .transition()
      .ease('quad')
      .duration(settings.speed)
      .delay(function() { return Math.random() * 5000; })
      .attr('x', function(d) { return parseInt(d3.select(this).attr('x')) + settings.offsetX; })
      .attr('y', settings.h)
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

window.onresize =  function() {
  d3.select(".board")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
};

var speedSlider = document.getElementById('rainSpeed');
var windSlider = document.getElementById('rainDirection');

document.addEventListener('keydown', function(event) {

  if (+speedSlider.value >= +speedSlider.min && +speedSlider.value <= +speedSlider.max){
    if(event.keyCode === 38) { // up
      speedSlider.value = speedSlider.value - 1;
    } else if(event.keyCode === 40) { // down
      speedSlider.value = speedSlider.value + 1;
    } else if(event.keyCode === 37) { // left
      console.log(windSlider.value);
      windSlider.value = windSlider.value - 1;
      console.log(windSlider.value);
    } else if(event.keyCode === 39) { // right
      windSlider.value = windSlider.value + 1;
    }
    settings.speed = 500 * speedSlider.value;
    settings.offsetX = (windSlider.value - 5) * 75;// 5 === 0
  }
});

