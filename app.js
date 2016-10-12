"use strict!"

var express     = require('express')
var MongoClient = require('mongodb').MongoClient
var assert      = require('assert');
var bodyParser  = require('body-parser')
var path        = require('path')
var app         = express();
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(express.static(path.join(__dirname, '/public')))
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
    	console.log("Inserted %d documents into the load collection", result.result.length)	
    }
    callback(result)
  });
}

var findDocuments = function(db, start, end, callback) {
  // Get the documents collection 
  var collection = db.collection('load');
  // Find some documents 
  collection.find({
  	// published_at : {
  	// 	$gte : start,
  	// 	$lt  : end
  	// }
  }, {
    limit: 1, 
    sort: { 
      $natural: -1
    } 
  }).toArray(function(err, result) {
  	if (err) {
  		console.log(err)
  	} else {
	    console.log("Query returns %d records", result.length);
	    callback(result)
  	}
  });
}

app.get('/', function (req, res) {
	// Dashboard
  res.render('index', {
    title: 'Fitchen',
    compartment: '(C1)',
    category: 'Chicken',
    temperature: 25,
    weight: '20 Kg',
    timestamp: '10 Oct 08:30 PM',
    expiry: '5 Days'
  })
})

app.post('/fitchen/event/load', function(req, res){
	res.setHeader('Content-Type', 'application/json')
	var data = req.body
	// Convert published_at from string to javascript Date object
  if (data.hasOwnProperty('published_at')) {
  	data.published_at = new Date(data.published_at) 
  }
  if (data.hasOwnProperty('createdAt')) {
    data.published_at = new Date(data.createdAt)
  }
  if (data.hasOwnProperty('OccurredAt')) {
    data.published_at = new Date(data.OccurredAt)
  }
  if (data.hasOwnProperty('value3')) {
    data.data = data.value3
  }
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
	var start = new Date(req.params.start)
	var end   = new Date(req.params.end)
	// console.log(req.params.start)
	// console.log(req.params.end)

	// Retrieve from MongoDB
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err)
		} else {
			findDocuments(db, start, end, function(result) {
				res.json(result)
				db.close()
			})
		}
	})
})

app.listen(5000, function () {
  console.log('Fitchen webhooks listening on port 5000!')
})