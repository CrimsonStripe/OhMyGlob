var Api = function(route, options, callback){
	if( callback === undefined ) {
		callback = options;
		options = {};
	}
	var response = {},
		responseCode = 200,
		data = options.data || {},
		method = options.method || "GET";

    switch (route) {
	    case "/rooms":
	    	if ( method === "GET" ){
		    	response.rooms = [
		    	    {
		    	    	_id: getRandomId(),
		    	    	title: "Mike's Room",
		    	    	createdDate : (new Date()).getTime()
		    	    },
		    	    {
		    	    	_id: getRandomId(),
		    	    	title: "Chris's Room",
		    	    	createdDate : (new Date()).getTime()
		    	    }
		    	];
	    	} else if ( method === "POST" ){
	    		response = {
	    				_id : getRandomId(),
	    				title : data.title,
	    				createdDate : (new Date()).getTime()
	    		};
	    	}
	    	break;
	    default:
	        console.log("unknown route");
    }
    callback(response, responseCode);

    var idIncrement = 0;
    function getRandomId(){
    	idIncrement++;
    	return "d" + new Date().getTime() + "_" + idIncrement;
    }
};