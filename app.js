var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/fitchen/event/load', function(req, res){
	console.log(req.body);
	res.send('Received!')
});

app.listen(5000, function () {
  console.log('Fitchen webhooks listening on port 5000!');
});