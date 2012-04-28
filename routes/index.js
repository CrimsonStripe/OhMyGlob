
/*
 * GET home page.
 */
 
var fs 		= require('fs');
var fbAPI = require('Facebook_Graph_API');

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
		
		var facebookUser = new graph.User(req.body.userId, req.body.accessToken);
		facebookUser.get(['friends'], function(err, facebookUser) {
		    console.dir(facebookUser.data);
				
				// Store in db
				var users = db.collection('users');
				var newUser = {
					fbid: req.body.userId,
					accessToken: req.body.accessToken,
					data: facebookUser.data
					};
				users.insert(newUser, function(err) {
					res.json(newUser);
				});
		})		
		res.json({success:true});
	});

};
