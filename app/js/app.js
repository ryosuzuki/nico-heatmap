
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
    var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 672 // - margin.left - margin.right,
    height = 70// - margin.top - margin.bottom;

    var data = [4, 8, 15, 16, 23, 42];
    var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

    var svg = d3.select('#nicoplayerContainerInner')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('z-index', 10000)
    .style('bottom', '78px')
    .style('position', 'absolute')
    .style('background', 'yellow')
    .append('g')

    var bar = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')

    bar.append('rect')
    .attr('x', function(d, index) { return x(index); })
    .attr('width', 10)
    .attr('y', function(d) { return y(d); })
    .attr('height', function(d) { return height - y(d);　};

  }

})













