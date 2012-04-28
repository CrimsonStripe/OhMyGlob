OhMyGlob = Ember.Application.create();

//MODELS

OhMyGlob.Room = Em.Object.extend({
	_id: 0,
	title: null,
	createdDate: 0
});

OhMyGlob.Seed = Em.Object.extend({
	_id: 0,
	title: "",
	type: "", //artist|song
	action: "", //added|liked|booed
	seed: null
});

OhMyGlob.Song = OhMyGlob.Seed.extend({
	spotifyId: 0,
	type: "song"
});

OhMyGlob.Artist = OhMyGlob.Seed.extend({
	type: "artist",
	action: "added"
});

OhMyGlob.User = Em.Object.extend({
	username: "",
	realName: "",
	fbid: 0
});

//CONTROLLERS

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

OhMyGlob.selectedRoomController = Ember.Object.create({
	content: null
});

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

OhMyGlob.RoomView = Em.View.extend({
	titleBinding: 'OhMyGlob.selectedRoomController.content.title'
});

//bootstrap
OhMyGlob.roomsController.populateRooms();
