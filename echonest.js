(function() {
  var Echonest, exec, fs, http, purl;
  purl = require('url');
  exec = require('child_process').exec;
  fs = require('fs');
  http = require('http');
  Echonest = (function() {
    function Echonest(filepath) {
      this.loadConf(filepath);
    }
    Echonest.prototype.loadConf = function(filepath) {
      return this.config = JSON.parse(fs.readFileSync(filepath));
    };
    Echonest.prototype.call = function(namespace, method, postData, callback) {
      return this.post(this.buildUrl(namespace, method), postData, callback);
    };
    Echonest.prototype.fingerprint = function(filepath, startSec, numSecs, callback) {
      var params;
      params = startSec + ' ' + numSecs;
      return this.proc(filepath, params, callback);
    };
    Echonest.prototype.proc = function(filepath, params, callback) {
      return exec(this.config.lib_path + ' ' + filepath + ' ' + params, function(err, stdout, stderr) {
        return callback(stdout);
      });
    };
    Echonest.prototype.post = function(rurl, postData, callback) {
      var options, req, url;
      url = purl.parse(rurl);
      options = {
        host: url.host,
        port: 80,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': postData.length
        }
      };
      console.log(options);
      req = http.request(options, function(res) {
        var data;
        data = '';
        res.setEncoding('utf-8');
        res.on('data', function(chuck) {
          return data += chuck;
        });
        return res.on('end', function() {
          return callback(data);
        });
      });
      req.on('error', function(e) {
        return console.log(e.message);
      });
      req.write(postData);
      return req.end();
    };
    Echonest.prototype.buildUrl = function(namespace, method) {
      return 'http://developer.echonest.com/api/v' + this.config.version + '/' + namespace + '/' + method + '?api_key=' + this.config.api_key;
    };
    return Echonest;
  })();
  module.exports = Echonest;
}).call(this);
