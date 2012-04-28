/*
 * Rooms list
 */

var _ = require('underscore');
var ObjectId = require('mongolian').ObjectId;
module.exports = function(app, db) {

	var rooms = db.collection("rooms");

	app.get('/room/:id', function(req, res){
		rooms.findOne({_id: new ObjectId(req.params.id) }, function(err, doc){
			if (err || doc == undefined) {
				res.json({error:err});
			} else {
				doc._id = doc._id.toString();
				res.json({room:doc});
			}
		});
	});

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

		var fbIds = (req.session && req.session.friends)
				  ? _.pluck(req.session.friends, 'name')
				  : [];
		if (req.session && req.session.userId) {
			fbIds.push( req.session.userId);
		}

		rooms.find({'users.fbid': {$in : fbIds} }).toArray( function(err, array){
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
			var newRoom = {	title: req.body.title };
				if (req.session && req.session.userId) {
					newRoom.users = [{fbid: req.session.userId}];
					console.log("has user_id: "+req.session.userId);
				} else {
					console.log("no user id");
				}

			rooms.insert(newRoom, function(err, doc){
				doc._id = doc._id.toString();
				console.log("inserted");
				console.log(doc);
				res.json({room : doc});
			});
		}
	});

};

