var q = require('q');
var admin = require("firebase-admin");
//var serviceAccount = require("./shenlong-webutil-firebase-adminsdk-r9qfl-1ddbda3021.json");

// Initialize the app with a service account, granting admin privileges

// configArray must have 2 item
// - json file 
// - url database
var connect = function(configArray){
    try {
        admin.initializeApp({
            credential: admin.credential.cert(configArray[0]),
            databaseURL: configArray[1]
        });
    } catch (error) {
        
    }
    
    return this;
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //     databaseURL: "https://shenlong-webutil.firebaseio.com"
    // });
}
var selectJSON = function (path) {
    var deferred = q.defer();
    var db = admin.database();
    var ref = db.ref(path);
    ref.once("value", function(data) {
        deferred.resolve(data);
    });
    return deferred.promise;
}
var insertJSON = function (path, obj) {
    var db = admin.database();
    var ref = db.ref(path);
    ref.set(obj);
}
var updateJSON = function (path, obj) {
    
}
var deleleJSON = function (path) {
    
}
module.exports =
{
    connect: connect,
    insertJSON: insertJSON,
    updateJSON: updateJSON,
    deleleJSON: deleleJSON,
    selectJSON: selectJSON
}