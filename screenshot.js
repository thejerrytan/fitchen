var webpage = require('webpage').create();

webpage.open('http://localhost:5000/', function() {
    webpage.render('screenshot.png');
    phantom.exit();
});