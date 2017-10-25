
/*
 * GET users listing.
 */
var uuid = require('uuid');
var request = require('request');
var fs = require('fs');
var ReadFrom = require('readfrom');
var http = require('http');
var _ = require('underscore');
var q = require('q');
var LZString = require('lz-string');
var JsonDB = require('node-json-db'); // see more https://www.npmjs.com/package/node-json-db





var OMIDDB = function () {
    var db = new JsonDB("./services/modules/omid/file/OMDs", true, true);
    return db;
};
var login = function (obj) {
    

    var userDB = OMIDDB();
    var user = undefined;
    
    try {
        user = userDB.getData("/users/" + obj.phone);
    } catch (error) {       
        console.error(error);       
    }
    var verifyCode = Math.floor(Math.random() * 9000) + 1000;
    if (user == undefined) {

        var dt = {};
        dt[obj.phone] = {
            "name": obj.name,
            "token": uuid.v4(),
            "code": verifyCode
        };
        userDB.push("/users/", dt);
    }
    else {
        userDB.push("/users/" + obj.phone + "/code", verifyCode);
    }
    var ti = userDB.getData("/twilio");
    console.log(ti);
    // send verifyCode to phone
    var twilioSMS = require('twilio')(
        ti.api,
        ti.token
    );
    twilioSMS.messages.create({
        from: ti.phone,
        to: obj.phone,
        body: "Your parking verify code is " + verifyCode
    }, function (err, message) {
        if (err) {
            console.error(err.message);
        }
    });

    return true;
}
var getTwilioInfo = function (obj) {
    var userDB = OMIDDB();
    try {
        var data = userDB.getData("/twilio")
        return data;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
var updateTwilioInfo = function (obj) {
    var userDB = OMIDDB();
    try {
        userDB.push("/twilio/", obj)
    } catch (error) {
        console.error(error);
        return false;
    }
    return true
}
var verifyLogin = function (obj) {
    var userDB = OMIDDB();
    var user = undefined;

    try {
        user = userDB.getData("/users/" + obj.phone);
    } catch (error) {
        console.error(error);
    }
    if (user == undefined) {
        return "";
    }
    else {
        return user.code == obj.code ? user.token : "";
    }

    return true;
}
module.exports =
{
    login: login,
    verifyLogin: verifyLogin,
    updateTwilioInfo: updateTwilioInfo,
    getTwilioInfo: getTwilioInfo

}