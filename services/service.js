
/*
 * GET users listing.
 */

var googlemap = require("./modules/google/googlemap");
var test = require("./modules/test");
var orion = require("./modules/orion/orion");
var omid = require("./modules/omid/omid");
module.exports =
{
	doaction: function(service, action, obj){
		console.log("service call doaction " + service + "/" + action + "/" + obj);
		var ret = eval(service +'["' + action + '"](obj)');		
		return ret;
	}
}