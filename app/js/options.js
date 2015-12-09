
var nicomap = require('./nicomap');

$(window).load( function () {
  $.getJSON('data.json', function (data) {
    nicomap.visualize(data);
  });
});
