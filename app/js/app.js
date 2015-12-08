
var request = require('request');
var cheerio = require('cheerio');
var comments = [];

$( function () {

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
      return comments;
    })
  }

  function visualize(comments) {


  }

})
