var Api = function(route, options, callback){
	if( callback === undefined ) {
		callback = options;
		options = {};
	}
	var response = {},
		responseCode = 200,
		data = options.data || {},
		method = options.method || "GET";

	$.ajax({
		url: "http://pandorify-coutram.rhcloud.com" + route,
		type: method,
		data: data,
		dataType: "json",
		error: function(e){
			console.log(e);
		},
		complete: function(){
			console.log("complete");
		},
		success: function(resp) {
			if (resp.error) {
				console.log(error);
			} else {
				callback(resp, responseCode);
				console.log("success rooms "+method);
				console.log(resp);
			}
		}
	});

    var idIncrement = 0;
    function getRandomId(){
    	idIncrement++;
    	return "d" + new Date().getTime() + "_" + idIncrement;
    }
};