
/*
 * GET users listing.
 */
var q = require('q');
var database = require("../libraries/firebase/firebase");
var test = function(obj){    
	
	return {msg:"test success", obj: obj} ;
};
var testAsync = function(obj){    	
	var deferred = q.defer();
	database.selectJSON("test").then(function(data){
		deferred.resolve(data);
	})
    return deferred.promise;


};
module.exports =
{	
	test : test, // call by [host].com/service/test/test/a
	testAsync : testAsync
}