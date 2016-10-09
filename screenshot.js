var webpage = require('webpage').create();
webpage.viewportSize = { width: 1024, height: 768 };
webpage.open('http://localhost:5000/', function() {
	setInterval(function(){
	    webpage.render('screenshot.png')
	    // phantom.exit()
	}, 3000)
})