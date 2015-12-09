
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
      visualize(comments, duration);
      return comments;
    })
  }

  function convertSeconds(text) {
    var ms = text.replace(/[^\d]/g, ':').split(':');
    var seconds = (+ms[0]) * 60 + (+ms[1]);
    return seconds;
  }

  function visualize(comments, duration) {
    var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = 672;
    var height = 70;

    var barWidth = width / duration;
    var data = []
    for (var i=0; i <= duration; i++) {
      var d = { value: 0, comments: [] }
      data.push(d);
    }

    comments.map( function (comment) {
      comment.seconds = convertSeconds(comment.time);
      return comment;
    }).sort(function (a, b) {
      return a.seconds - b.seconds;
    });
    comments.forEach( function (comment) {
      var d = data[comment.seconds];
      d.comments.push(comment);
      d.value = Math.pow(d.comments.length, 0.6);
      data[comment.seconds] = d;
    });

    console.log(data);

    var colors = d3.scale.category20();

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, duration]);

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

    heatmap();

    function area () {
      var area = d3.svg.area()
      .x(function (d, i) { return x(i); })
      .y0(height)
      .y1(function (d) { return y(d.value); })

      var line = d3.svg.line()
      .x(function (d, i) { return x(i); })
      .y(function (d) { return y(d.value); })

      var stream = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      stream.append('path')
      .attr('d', area(data))
      .style('fill', 'red')
    }

    function bar () {
      var bar = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      bar.append('rect')
      // .attr('transform', function (d, i) { return 'translate(' + i * barWidth + ',0)'; })
      .attr('x', function (d) { return i * barWidth; })
      .attr('y', function (d) { return y(d.value); })
      .attr('width', barWidth)
      .attr('height', function (d) { return height - y(d.value);})
      .attr('fill', function (d) { return colors(d.value); })
    }

    function heatmap () {

      // var colors = [
      //   'rgb(165,  0, 38)',
      //   'rgb(215, 48, 39)',
      //   'rgb(244,109, 67)',
      //   'rgb(253,174, 97)',
      //   'rgb(254,224,139)',
      //   'rgb(255,255,191)',
      //   'rgb(217,239,139)',
      //   'rgb(166,217,106)',
      //   'rgb(102,189, 99)',
      //   'rgb( 26,152, 80)',
      //   'rgb(  0,104, 55)',
      // ]

      var cellHeight = 20;
      var rect = svg.selectAll('g')
      .data(data)
      .enter()
      .append('g')

      rect.append('rect')
      .attr('width', barWidth)
      .attr('height', cellHeight)
      .attr('x', function (d, i) { return i * barWidth; })
      .attr('y', function (d) { return height - cellHeight; })
      .attr('fill', function (d) { return colors(d.value); })
    }

  }

})













