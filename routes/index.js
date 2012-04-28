
/*
 * GET home page.
 */
 
module.exports = function(app, db) {

	app.get('/', function(req, res){
	  res.render('index', { title: 'Express!' })
	});

};
