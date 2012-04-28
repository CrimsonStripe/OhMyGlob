
/*
 * GET home page.
 */
var fs = require('fs');

module.exports = function(app, db) {

	app.get('/', function(req, res){
		fs.readFile('index.html', function (err, html) {
		  if (err) throw err;
			res.contentType("text/html");
		  res.send(html);
		});
	});

	app.post('/login', function(req, res){
		req.session.user = req.body.userId;
		req.session.accessToken = req.body.accessToken;
		req.session.friends = req.body.friends;
		
		res.json({friends:req.session.friends});
	});

};
