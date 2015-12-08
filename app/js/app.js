
var request = require('request');
var cheerio = require('cheerio');
var comments = [];
window.comments = comments;

$(window).load( function () {

  var id = window.location.pathname.split('/')[2];
  getComments(id);

  function getComments(id) {
    var url = "http://nicoco.net/" + id;
    console.log(url)
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
      console.log(comments);
      visualize(comments);
      return comments;
    })
  }

  function visualize(comments) {
    var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = 672;
    var height = 70;

    var data = [4, 8, 15, 16, 23, 42];
    var barWidth = width / data.length;

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data)]);
    var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data)]);

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
    .attr('y', function (d) { return y(d); })
    .attr('height', function (d) { return height - y(d);});
  }

})













