/*
 * Seed controls
 */

var ObjectId = require('mongolian').ObjectId;

module.exports = function(app, db) {

	var rooms = db.collection("rooms");

	app.put('/room/:roomId/seed/:action', function(req, res){
		  
		if (req.params.action.match(/add|like|boo/)) {
				
			// Add seed to database
			rooms.findOne({_id: new ObjectId(req.body.roomId)}, function(err, doc){
				
				if (err) {
					res.json({error:err});
				} else {
					
					if (doc.seeds == undefined) {
						doc.seeds = [];
					}
					
					var newSeed = {
						displayName: 	req.body.displayName,
						spotifyId:		req.body.spotifyId,
						seedType:			req.body.seedType,
						action:				req.params.action
						};
					
					doc.seeds.push( newSeed, function(err){
						if (err) {
							res.json({error:'Failed to '+req.params.action+' seed'});
						} else {
							res.json({success:true});
						}
					});
					
				}
				
			});
				
		} else {
			res.json({error:req.params.action+" is not a valid action!"});
		}
			
	});


};


