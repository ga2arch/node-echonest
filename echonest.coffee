purl = require 'url'
exec = require('child_process').exec
fs = require 'fs'
http = require 'http'

class Echonest
	constructor: (filepath) ->
		@loadConf filepath
	
	loadConf: (filepath) ->
		@config = JSON.parse fs.readFileSync filepath
		
	call: (namespace, method, postData, callback) ->
		@post @buildUrl(namespace, method), postData, callback	
	
	fingerprint: (filepath, startSec, numSecs, callback) ->
		params = startSec+' '+numSecs
		@proc filepath, params, callback
	
	proc: (filepath, params, callback) ->
		exec @config.lib_path+' '+filepath+' '+params, (err, stdout, stderr) ->
			callback stdout

	post: (rurl, postData, callback) ->
		url = purl.parse rurl
		options = host: url.host, port: 80, path: url.pathname+url.search, method: 'POST', headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Length': postData.length,
		}
		console.log options
		req = http.request options, (res) ->
			data = ''
			res.setEncoding 'utf-8'
			res.on 'data', (chuck) ->
				data += chuck
			res.on 'end', ->
				callback data
		req.on 'error', (e) ->
			console.log e.message
		req.write postData
		req.end()	

	buildUrl: (namespace, method) ->
		'http://developer.echonest.com/api/v'+@config.version+'/'+namespace+'/'+method+'?api_key='+@config.api_key
	
module.exports = Echonest		