"use strict!"

var express     = require('express')
var MongoClient = require('mongodb').MongoClient
var assert      = require('assert');
var bodyParser  = require('body-parser')
var app         = express();
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.set('views', './views')
app.set('view engine', 'jade')

var url = 'mongodb://localhost:27017/fitchen';
var insertDocument = function(db, data, callback) {
  // Get the load collection 
  var collection = db.collection('load')
  // Insert some documents 
  collection.insert(data, function(err, result) {
    if (err) {
    	console.log(err)
    } else {
    	console.log("Inserted %d documents into the load collection", result.length)	
    }
    callback(result)
  });
}

var findDocuments = function(db, start, end, callback) {
  // Get the documents collection 
  var collection = db.collection('load');
  // Find some documents 
  collection.find({
  	published_at : {
  		$gte : start,
  		$lt  : end
  	}
  }).toArray(function(err, result) {
  	if (err) {
  		console.log(err)
  	} else {
	    console.log("Query returns %d records", result.length);
  	}
    callback(result)
  });
}

app.get('/', function (req, res) {
	// Dashboard
  res.send('Hello World!');
})

app.post('/fitchen/event/load', function(req, res){
	res.setHeader('Content-Type', 'application/json')
	var data = req.body
	console.log(data)

	// Insert into MongoDB
	MongoClient.connect(url, function(err, db) {
  	if (err) {
  		console.log(err)
  	} else {
  		console.log("Connection established")
	 		insertDocument(db, data, function(result) {
	  		db.close()
	 		})
  	}
	});
	res.json({status: 'Received!'})
})

app.get('/data/:start/:end', function(req, res) {
	var start = req.params.start
	var end   = req.params.end
	console.log(req.params.start)
	console.log(req.params.end)

	// Retrieve from MongoDB
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err)
		} else {
			findDocuments(db, start, end, function(result) {
				app.json(result)
				db.close()
			})
		}
	})
})

app.listen(5000, function () {
  console.log('Fitchen webhooks listening on port 5000!')
})