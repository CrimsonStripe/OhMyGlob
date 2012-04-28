OhMyGlob = Ember.Application.create();

//MODELS

OhMyGlob.Room = Em.Object.extend({
	_id: 0,
	title: null,
	createdDate: 0
});

OhMyGlob.Seed = Em.Object.extend({
	_id: 0,
	spotifyId: 0,
	title: "",
	seedType: "", //artist|song
	action: "", //added|liked|booed
	seed: null
});

OhMyGlob.Song = OhMyGlob.Seed.extend({
	seedType: "song"
});

OhMyGlob.Artist = OhMyGlob.Seed.extend({
	seedType: "artist",
	action: "added"
});

OhMyGlob.User = Em.Object.extend({
	_id: 0,
	username: "",
	realName: "",
	fbid: 0
});

//CONTROLLERS

OhMyGlob.CreateSeedView = Em.TextField.extend({
	insertNewline: function() {
		var value = this.get('value');

		if (value) {
			OhMyGlob.seedsController.saveArtist(value);
			this.set('value', '');
		}
	}
});

OhMyGlob.seedsController = Em.ArrayProxy.create({
	content: [],

	roomIdBinding: 'OhMyGlob.selectedRoomController.content._id',

	getSpotifyArtist: function(displayName, callback) {
		var search = new models.Search(displayName);
		search.observe(models.EVENT.CHANGE, function() {
			var chosenArtist;
			search.artists.forEach(function(artist) {
				chosenArtist = chosenArtist || artist;
			});
console.log(chosenArtist.data);
			callback(chosenArtist.data);
		});

		search.appendNext();
	},

	createArtist: function(data) {
		var artist = OhMyGlob.Artist.create(data);
		this.pushObject(artist);
	},

	saveArtist: function(displayName) {
		var self = this;
		this.getSpotifyArtist(displayName, function(artist){
			Api('/room/' + self.get('roomId') + "/seed/add", {
				method: "PUT",
				data: {
					displayName: artist.name,
					spotifyId: artist.uri.replace('spotify', 'spotify-WW'),
					seedType: "artist"
				}
			}, function( response){
console.log(response);
				self.createArtist(response.seed);
			});
		});
	}
});

OhMyGlob.roomsController = Em.ArrayProxy.create({
	content: [],

	saveRoom: function(title) {
		var self = this;
		Api('/rooms', {
			method: "POST",
			data: {
				title: title
			}
		}, function( response){
			self.createRoom(response.room);
		});
	},

	createRoom: function(data) {
		var room = OhMyGlob.Room.create(data);
		this.pushObject(room);
	},

	populateRooms: function(){
		var self = this,
			x = 0;
		Api('/rooms', function(data){
			for( ; x < data.rooms.length; x++ ){
				self.createRoom(data.rooms[x]);
			}
		});
	}
});

OhMyGlob.set('selectedRoomController', Ember.Object.create({
	content: null,
	users: null,
	playlist: null,
	seedsBinding: 'OhMyGlob.seedsController.content',
	loadRoom: function(){
		var self = this;

		this.set('users', Ember.A([]));
		this.set('playlist', Ember.A([]));

		Api('/room/' + this.content._id, function(data){
			var x = 0,
				y = 0,
				z = 0,
				len;

			len = data.room.users && data.room.users.length;
			for( ; x < len; x++ ){
				self.users.pushObject(OhMyGlob.User.create(data.room.users[x]));
			}

			len = data.room.playlist && data.room.playlist.length;
			for( ; y < len; y++ ){
				self.playlist.pushObject(OhMyGlob.Song.create(data.room.playlist[x]));
			}

			len = data.room.seeds && data.room.seeds.length;
			for( ; z < len; z++ ){
				OhMyGlob.seedsController.createArtist(data.room.seeds[z]);
			}
		});
	}.observes('content')
}));

//VIEWS FOR ROOMS SELECTOR
OhMyGlob.RoomsView = Em.View.extend({
	totalBinding: 'OhMyGlob.roomsController.length',

	totalString: function() {
		var total = this.get('total');
		return total + (total === 1 ? " room" : " rooms");
	}.property('total')
});

OhMyGlob.RoomListView = Em.View.extend({
	click: function() {
		var content = this.get('content');
		OhMyGlob.selectedRoomController.set('content', content);
	}
});

OhMyGlob.CreateRoomView = Em.TextField.extend({
	insertNewline: function() {
		var value = this.get('value');

		if (value) {
			OhMyGlob.roomsController.saveRoom(value);
			this.set('value', '');
		}
	}
});

//VIEWS FOR SINGLE ROOM
OhMyGlob.UsersView = Em.View.extend({
	contentBinding: 'OhMyGlob.selectedRoomController.users'
});

OhMyGlob.RoomView = Em.View.extend({
	titleBinding: 'OhMyGlob.selectedRoomController.content.title'
});

//bootstrap
OhMyGlob.roomsController.populateRooms();

document.getElementById('container').style.display = 'block';

// Login to Facebook
var sp = getSpotifyApi(1);
var auth = sp.require('sp://import/scripts/api/auth');

auth.authenticateWithFacebook('266810276747668', ['user_about_me'], {

	onSuccess : function(accessToken, ttl) {
		console.log("Success! Here's the access token: " + accessToken);
		console.log(ttl);
		$.ajax({
			url: "https://graph.facebook.com/me",
			type: "GET",
			data: {"access_token":accessToken},
			dataType: "jsonp",
			success: function(resp) {
				console.log(resp.id);
				var userId = resp.id;

				// Get friends
				$.ajax({
					url: "https://graph.facebook.com/me/friends",
					type: "GET",
					data: {"access_token":accessToken},
					dataType: "jsonp",
					success: function(resp) {
						OhMyGlob.LoginUser( userId, accessToken, resp.data );
					}
				});


				// Send user id and access token to db
			}
		});
	},

	onFailure : function(error) {
		console.log("Authentication failed with error: " + error);
	},

	onComplete : function() { }
});

OhMyGlob.LoginUser = function(userId, accessToken, friends) {
	$.ajax({
		url: 'http://pandorify-coutram.rhcloud.com/login',
		type: 'post',
		data: {userId: userId, accessToken: accessToken, friends: friends},
		dataType: 'json',
		success: function(resp) {
			// Show rooms
			$('#container').fadeIn();
			console.log(resp);
		}
	});
};
