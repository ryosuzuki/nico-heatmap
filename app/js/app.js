
var request = require('request');
var cheerio = require('cheerio');

$(window).load( function () {

  var id = window.location.pathname.split('/')[2];
  var comments = [];
  collect(id);

  function collect(id) {
    var url = "http://nicoco.net/" + id;
    request(url, function (err, res, html) {
      var $ = cheerio.load(html);
      $("#com_table > tr").each( function () {
        var comment = {
          index:   $('td', this).eq(0).text(),
          time:    $('td', this).eq(1).text(),
          user_id: $('td', this).eq(2).text(),
          content: $('td', this).eq(3).text(),
          date:    $('td', this).eq(5).text(),
        }
        comments.push(comment);
      });
      var time = $('#img_wrap > div > div.length').text()
      var duration = convertSeconds(time);
      comments.map( function (comment) {
        comment.seconds = convertSeconds(comment.time);
        return comment;
      }).sort(function (a, b) {
        return a.seconds - b.seconds;
      });
      generate(comments, duration);
      return comments;
    })
  }

  function convertSeconds(text) {
    var ms = text.replace(/[^\d]/g, ':').split(':');
    var seconds = (+ms[0]) * 60 + (+ms[1]);
    return seconds;
  }

  function generate(comments, duration) {
    var limit = 200;
    var length = (duration <= limit) ? duration : limit;
    var scale = duration/length;

    var data = []
    for (var i=0; i <= length; i++) {
      var d = { value: 0, comments: [] }
      data.push(d);
    }
    comments.forEach( function (comment) {
      var index = Math.floor(comment.seconds/scale);
      var d = data[index];
      d.comments.push(comment);
      d.value = Math.pow(d.comments.length, 1.1);
      data[index] = d;
    });
    console.log(data);
    visualize(data);
  }

  function visualize(data) {
    var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = 672;
    var height = 85;
    var barWidth = width / data.length;
    var barMargin = barWidth / 3;

    var green = ['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'];
    var blue  = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
    var orange = ['#ffffd4','#fed98e','#fe9929','#d95f0e','#f25123'];
    var gray = ['#f7f7f7','#d9d9d9','#bdbdbd','#969696','#636363'];
    var white = ['#636363', '#969696', '#bdbdbd', '#d9d9d9', '#f7f7f7']
    var orangePurple = ['#5e3c99','#b2abd2','#f7f7f7','#fdb863','#e66101'];
    var yellowGreen = ['#018571','#80cdc1','#f5f5f5','#dfc27d','#a6611a'];
    var redBlue = ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c'];


    var color = gray;

    var colorScale = d3.scale.linear()
    .range(color)
    .domain([
      0,
      d3.max(data, function (d) { return d.value; })*0.1,
      d3.max(data, function (d) { return d.value; })*0.3,
      d3.max(data, function (d) { return d.value; })*0.5,
      d3.max(data, function (d) { return d.value; })*0.7
    ]);

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, data.length]);

    var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function (d) { return d.value; })]);

    var svg = d3.select('#nicoplayerContainerInner')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('z-index', 1000)
    .style('bottom', '75px')
    .style('position', 'absolute')
    // .style('background', 'rgba(255, 255, 255, 0.5)')
    .append('g')

    area();

    function area () {
      var area1 = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value*1.0); })

      var area2 = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value*0.7); })

      var area3 = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value*0.4); })

      var area4 = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value*0.2); })

      var area5 = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value*0.1); })


      var line = d3.svg.line()
      .x(function (d, i) { return x(i); })
      .y(function (d) { return y(d.value); })

      var stream = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      stream.append('path')
      .attr('d', area1(data))
      .style('fill', function (d) { return color[4]; })

      stream.append('path')
      .attr('d', area2(data))
      .style('fill', function (d) { return color[3]; })

      stream.append('path')
      .attr('d', area3(data))
      .style('fill', function (d) { return color[2]; })

      stream.append('path')
      .attr('d', area4(data))
      .style('fill', function (d) { return color[1]; })

      stream.append('path')
      .attr('d', area5(data))
      .style('fill', function (d) { return color[0]; })


    }

    function bar () {
      var bar = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      bar.append('rect')
      .attr('transform', function (d, i) { return 'translate(' + i * barWidth + ',0)'; })
      .attr('y', function (d) { return y(d.value); })
      .attr('width', barWidth - barMargin)
      .attr('height', function (d) { return height - y(d.value);})
      .attr('fill', function (d) { return colorScale(d.value); })
    }

    function heatmap () {
      var cellHeight = 10;
      var rect = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      rect.append('rect')
      .attr('width', barWidth)
      .attr('height', cellHeight)
      .attr('x', function (d, i) { return i * barWidth; })
      .attr('y', function (d) { return height - cellHeight; })
      .attr('fill', function (d) { return colorScale(d.value); })
    }

  }

})













