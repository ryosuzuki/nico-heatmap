
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
    var data = [];
    for (var i=0; i <= duration; i++) {
      data.push([]);
    }

    comments.map( function (comment) {
      comment.seconds = convertSeconds(comment.time);
      return comment;
    });
    comments.sort(function (a, b) {
      return a.seconds - b.seconds;
    });

    console.log(data);
    console.log(comments);
    comments.forEach( function (comment) {
      console.log(comment)
      data[comment.seconds].push(comment);
    })
    console.log(data);

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, duration]);

    var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function (d) { return d.length; })]);

    var svg = d3.select('#nicoplayerContainerInner')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('z-index', 1000)
    .style('bottom', '78px')
    .style('position', 'absolute')
    .style('background', 'yellow')
    .append('g')

    var bar = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')

    bar.append('rect')
    .attr('transform', function (d, i) { return 'translate(' + i * barWidth + ',0)'; })
    .attr('width', barWidth - 1)
    .attr('y', function (d) { return y(d.length); })
    .attr('height', function (d) { return height - y(d.length);});
  }

})













