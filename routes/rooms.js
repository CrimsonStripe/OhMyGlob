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
				res.json(array);
				/*
				var output = [];
								
				array.forEach(function(item){
					output.push({ title: item.title, users: items.users });
					console.log(item.title);
				});
				res.json( output );
				*/
			}
		});		
	});

};

