/*
 * Rooms list
 */

var _ = require('underscore');
module.exports = function(app, db) {

	var rooms = db.collection("rooms");

	/* 
	 * Get a list rooms
	 * { owned: [], friends: []}
	 * Room
	 * {
	 *  name: string,
	 *	seeds: [],
	 *	creator: facebook id
	 *  }
	 */
	app.get('/rooms', function(req, res){
		// Force auth
		/*
		if ( ! req.user.fbid) {
			// todo, return
		} 
		*/
		
		fbid = '124567';
		rooms.find({'users.fbid': fbid}).toArray( function(err, array){
			if (err) {
				console.log("error");
				console.log(err); 
				res.json({error:err});
			} else {
				array.map(function(i){i._id = i._id.toString()});
				console.log(array);
				res.json({rooms : array});
			}
		});		
	});
	
	// Create a room
	// todo change to POST
	app.post('/rooms', function(req, res){
		if (! req.body.title) {
			res.json({error:"Need to pass a title"});
		} else {
			var newRoom = {
				title: req.body.title,
				users: [ {fbid: '124567'}],
				};
			rooms.insert(newRoom, function(err, doc){
				doc._id = doc._id.toString();
				console.log("inserted");
				console.log(doc);
				res.json({room : doc});
			});
		}
	});

};

