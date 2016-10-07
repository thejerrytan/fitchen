"use strict!"

var express = require('express')
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

// app.use(express.json())       // to support JSON-encoded bodies
// app.use(express.urlencoded()) // to support URL-encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.post('/fitchen/event/load', function(req, res){
	res.setHeader('Content-Type', 'application/json')
	console.log(req.body)
	res.json({status: 'Received!'})
})

app.listen(5000, function () {
  console.log('Fitchen webhooks listening on port 5000!')
})