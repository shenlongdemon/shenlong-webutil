var admin = require("firebase-admin");
var serviceAccount = require("./shenlong-webutil-firebase-adminsdk-r9qfl-1ddbda3021.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shenlong-webutil.firebaseio.com"
});

var insertJSON = function (path, obj) {
    var db = admin.database();
    var ref = db.ref(path);
    ref.set(obj);
}
var updateJSON = function (obj) {
    
}
var deleleJSON = function (obj) {
    
}
module.exports =
{
    insertJSON: insertJSON,
    updateJSON: updateJSON,
    deleleJSON: deleleJSON
}