
/*
 * GET users listing.
 */
var uuid = require('uuid');
var fs = require('fs');
var _ = require('underscore');
var q = require('q');
var database = require("../../libraries/database/database");


var SHARELOCSLDB = function () {
    var serviceAccount = require("../../libraries/database/firebase/sharelocsl-b3073-firebase-adminsdk-mjxq2-37dc2bc6ae.json");
	var url = "https://sharelocsl-b3073.firebaseio.com";
	var configs = [serviceAccount, url];
	var db = database.connect(configs);
	return db;	
};

/**
 * 
 * @param {*} obj : 
 * {
 *      owner : "phone number like +84905690200",
 *      location: {
 *          name : "home",
 *          coordinate: {
 *              latitude : 0,
 *              longitude : 0
 *          }
 *      }
 * } 
 */
var addLocationAsync = function (obj) {
    var deferred = q.defer();
    try{
        var db = SHARELOCSLDB();
        var id = uuid.v4();

        var owner = obj.owner;
        var data = obj.location;        
        data.id = id;

        db.insertJSON("users/" + owner + "/locations/" + id, data);

        deferred.resolve(data);        
    }
    catch(ex){
        deferred.reject(ex);    
    }
    return deferred.promise;
}
/**
 * 
 * @param {Direction} obj 
 * {
 *      owner : "phone number like +84905690200",
 *      direction: {
 *          id: "",
 *          name : "home",
 *          description : "",
 *          points: [
 *              {
 *                  id : "",
 *                  key: "",
 *                  index: 0,
 *                  title: "title",
 *                  description: "title",
 *                  coordinate: {
 *                      latitude : 0,
 *                      longitude : 0
 *                  }
 *              },
 *              ...
 *          ],
 *          notes: [
 *              {
 *                  title: "title",
 *                  description: "title",
 *                  coordinate: {
 *                      latitude : 0,
 *                      longitude : 0
 *                  }
 *              },
 *              ...
 *          ]
 *      }
 * } 
 */
var addDirectionAsync = function (obj) {
    var deferred = q.defer();
    try{
        var db = SHARELOCSLDB();
        var id = uuid.v4();

        var owner = obj.owner;
        var data = obj.direction;        
        data.id = id;
        
        db.insertJSON("users/" + owner + "/directions/" + id, data);

        deferred.resolve(data);        
    }
    catch(ex){
        deferred.reject(ex);    
    }
    return deferred.promise;
}
module.exports =
{
    addLocationAsync: addLocationAsync
}