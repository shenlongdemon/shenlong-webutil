
/*
 * GET users listing.
 */
var q = require('q');
var database = require("../libraries/database/database");
var SL_WU_FIR = function(){
	var serviceAccount = require("../libraries/database/firebase/shenlong-webutil-firebase-adminsdk-r9qfl-1ddbda3021.json");
	var url = "https://shenlong-webutil.firebaseio.com";
	var configs = [serviceAccount, url];
	var db = database.connect(configs);
	return db;	
}
var test = function(obj){    
	
	return {msg:"test success", obj: obj} ;
};
var testAsync = function(obj){    	
	var deferred = q.defer();
	var db = SL_WU_FIR();
	db.selectJSON("test").then(function(data){			
		deferred.resolve(data);
	})
    return deferred.promise;


};
module.exports =
{	
	test : test, // call by [host].com/service/test/test/a
	testAsync : testAsync
}