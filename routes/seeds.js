/*
 * Seed controls
 */

module.exports = function(app, db) {

	app.put('/room/:id/seed/add', function(req, res){
	  res.render('index', { title: 'Express' })
	});

	app.put('/room/:id/seed/like', function(req, res){
	  res.render('index', { title: 'Express' })
	});

	app.put('/room/:id/seed/boo', function(req, res){
	  res.render('index', { title: 'Express' })
	});

};


