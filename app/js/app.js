
var nicomap = require('./nicomap');

$(window).load( function () {
  var id = window.location.pathname.split('/')[2];
  nicomap.collect(id);
});
