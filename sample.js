(function() {
  var echo, nest;
  echo = require('./echonest.js');
  nest = new echo('./config.json');
  nest.fingerprint('./preview.mp3.3', 35, 30, function(data) {
    return nest.call('song', 'identify', data, function(data) {
      return console.log(data);
    });
  });
}).call(this);
