/*
 * Rooms list
 */

module.exports = function(app, db) {

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
		if ( ! req.session.fbid) {
			// todo, return
		} 
	  res.render('index', { title: 'Rooms' })
		
	});

};

