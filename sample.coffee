echo = require './echonest.js'

nest = new echo('./config.json')
nest.fingerprint './preview.mp3.3', 35, 30, (data) ->
	nest.call 'song', 'identify', data, (data) ->
		console.log data
