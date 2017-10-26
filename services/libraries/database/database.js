

var database = require("./firebase/firebase");



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
    insertJSON: insertJSON,
    updateJSON: updateJSON,
    deleleJSON: deleleJSON,
    selectJSON: selectJSON
}