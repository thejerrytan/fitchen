var webpage = require('webpage').create();
webpage.viewportSize = { width: 3840, height: 2160 };
webpage.open('http://localhost:5000/', function() {
	setInterval(function(){
	    webpage.render('./screenshot.png')
	    webpage.render('./debug/fitchen1/screenshot.png')
	    webpage.render('./debug/fitchen2/screenshot.png')
	    // phantom.exit()
	}, 3000)
})