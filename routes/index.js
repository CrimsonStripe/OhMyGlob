
/*
 * GET home page.
 */
 
var fs = require('fs');

module.exports = function(app, db) {

	app.get('/', function(req, res){
		fs.readFile('public/index.html', function (err, html) {
		  if (err) throw err;
			res.contentType("text/html");
		  res.send(html);
		});
	});

};
