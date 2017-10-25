
/*
 * GET users listing.
 */
var database = require("../libraries/firebase/firebase");
var test = function(obj){    	
	database.insertJSON("test",{value:obj});
	return {msg:"test success", obj: obj} ;
};

module.exports =
{	
	test : test // call by [host].com/service/test/test/a
}