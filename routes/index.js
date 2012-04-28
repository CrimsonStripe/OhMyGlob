
/*
 * GET home page.
 */
 
var fs 		= require('fs');

module.exports = function(app, db) {

	app.get('/', function(req, res){
		fs.readFile('public/index.html', function (err, html) {
		  if (err) throw err;
			res.contentType("text/html");
		  res.send(html);
		});
	});
	
	app.post('/login', function(req, res){
		req.session.user = req.body.userId;
		req.session.accessToken = req.body.accessToken;
		
		res.json({success:true});
	});

};
