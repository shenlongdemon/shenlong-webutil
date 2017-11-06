

var database = require("./firebase/firebase");



var connect = function(configArray){   
    database.connect(configArray);
    return this;
}
var selectJSON = function (path) {    
    return database.selectJSON(path);
}
var insertJSON = function (path, obj) {
    return database.insertJSON(path, obj);
}
var updateJSON = function (path, obj) {
    return database.updateJSON(path, obj);
}
var deleleJSON = function (path) {
    return database.deleleJSON(path);
}

module.exports =
{
    connect: connect,
    insertJSON: insertJSON,
    updateJSON: updateJSON,
    deleleJSON: deleleJSON,
    selectJSON: selectJSON
}