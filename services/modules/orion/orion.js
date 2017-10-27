
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
var database = require("../../libraries/database/database");


var LINK_MAIN = "https://docs.google.com/spreadsheets/d/1Z45EBAQE84iD2je4D1TVFxChzIf2il5kmsXbd_rovCE/pub?gid=0&single=true&output=csv";

var SEPARATOR_ANALYZE_TXT_FILE = "---";
var DELAY = "Delay";
var OPEN_PORT = "Open Port";
var RESET_CPU = "Reset CPU";
var FACTORY_RESET = "Factory Reset";
var RUN_APP = "Run App";
var WRITE_SETTING = "Write Setting";
var SETTINGS = "SETTINGS";
var UPDATE_FW = "UpdateFW";
var SEPARATOR_FIRMWARE = "Firmware";
var SEPARATOR_TEXT_FILE = "---";
var COMPRESSTYPE = {
    NONE: 1,
    LZSTRING: 2,
    GZIP: 3,
    properties: {
        1: { name: "none", value: 1, code: "N" },
        1: { name: "lz-string", value: 2, code: "L" },
        2: { name: "gzip", value: 3, code: "G" }
    }
};
var FWDB = function () {
    var serviceAccount = require("../../libraries/database/firebase/shenlong-webutil-firebase-adminsdk-r9qfl-1ddbda3021.json");
	var url = "https://shenlong-webutil.firebaseio.com";
	var configs = [serviceAccount, url];
	var db = database.connect(configs);
	return db;	
};
var ESPDB = function () {
    var db = new JsonDB("./services/modules/orion/file/ESPs", true, true);
    return db;
};
var analyzeLink = function (link) {
    var res = {};    
    var deferred = q.defer();    
    ReadFrom().url(link).then(function (body) {       
        var idx = 1;
        var cts = body.split(SEPARATOR_ANALYZE_TXT_FILE);
        _.each(cts, function (str) {
            str = str.replace(/\r\n/g, "");
            if (str.indexOf(DELAY) >= 0) {
                res.Delay = str.split(";")[1];
            }
            else if (str.indexOf(OPEN_PORT) >= 0) {                
                var data = str.split(";");
                res.OpenPortName = data[1];
                res.OpenPort = data.slice(2);
            }
            else if (str.indexOf(RESET_CPU) >= 0) {
                var data = str.split(";");
                res.ResetCPUName = data[1];
                res.ResetCPU = data.slice(2);
            }
            else if (str.indexOf(FACTORY_RESET) >= 0) {
                var data = str.split(";");
                res.FactoryResetName = data[1];
                res.FactoryReset = data.slice(2);
            }
            else if (str.indexOf(RUN_APP) >= 0) {
                var data = str.split(";");
                res.RunAppName = data[1];
                res.RunApp = data[2];
            }
            else if (str.indexOf(WRITE_SETTING) >= 0) {
                var data = str.split(";");
                res.WriteSettingName = data[1];
                res.WriteSetting = data[2];
            }
            else if (str.indexOf(SETTINGS) >= 0) {
                var data = str.split(";");
                var settings = data.slice(1);
                var items = [];
                var i = 0;
                for (i = 0 ; i < settings.length / 2; i++) {
                    var item = { Name: settings[i * 2], Code: settings[i * 2 + 1].toUpperCase() };
                    items.push(item);
                }
                res.Settings = items;
            }
            else if (str.indexOf(UPDATE_FW) >= 0) {
                
                var ufw = str.substring(UPDATE_FW.length + 1, str.length - UPDATE_FW.length - 1);               
                var datas = ufw.split(SEPARATOR_FIRMWARE);                
                var items = [];
                _.each(datas, function (fw) {                    
                    var strs = fw.split(";");                    
                    if (strs.length > 2) {
                        var name = strs[0].trim();
                        var display = parseInt(strs[1].trim());
                        var code = _.rest(strs, 2);                        
                        var item = { Name: name, Display: display, Code: code };
                        items.push(item);
                    }
                });

                res.UpdateFW = items;                
            }
            if (idx == cts.length) {                
                deferred.resolve(res);
            }
            else {
                idx += 1;
            }
        });
    });
    return deferred.promise;
};

var analyzeNameAndLink = function (nameAndLink) {    
    var nameLink = nameAndLink.split(";");
    var retObj = {};
    retObj.Name = nameLink[0].trim();
    var deferred = q.defer();
    analyzeLink(nameLink[1]).then(function (data) {
        retObj.Object = data;
        deferred.resolve(retObj);
    });
    return deferred.promise;
};

var getTextFileNewAsync = function (compressType) {
    var fws = FWDB();
    var resObj = [];
    var deferred = q.defer();
    try {
        var ref = fws.selectJSON("Orion/IFC/FW").then(function(snapshots){
            var data = snapshots.val();
            var ids = Object.keys(data);
            var i = 0;
            
            for (i = 0  ; i < ids.length; i++) {
                var res = {};
                var id = ids[i];
                var obj = data[id];
                console.log(obj);
                res.Delay = obj.delay;
                res.OpenPortName = obj.openPort.name;
                res.OpenPort = _.filter(obj.openPort.data.replace("\n", "").replace("\t", "").split(";"), function (item) { return item != undefined && item.trim().length > 0;});
    
                res.ResetCPUName = obj.resetCPU.name;
                res.ResetCPU = _.filter(obj.resetCPU.data
                                        .replace("\n", "").replace("\t", "")
                                        .split(";"), function (item) {
                                            return item != undefined && item.trim().length > 0;
                                        });
    
                res.FactoryResetName = obj.factoryReset.name;
                res.FactoryReset = _.filter(obj.factoryReset.data
                                        .replace("\n", "").replace("\t", "")
                                        .split(";"), function (item) {
                                            return item != undefined && item.trim().length > 0;
                                        });
                
                res.RunAppName = obj.runApp.name;
                res.RunApp = _.filter(obj.runApp.data
                                        .replace("\n", "").replace("\t", "")
                                        .split(";"), function (item) {
                                            return item != undefined && item.trim().length > 0;
                                        });;
    
                res.WriteSettingName = obj.writeSetting.name;
                res.WriteSetting = _.filter(obj.writeSetting.data
                                        .replace("\n", "").replace("\t", "")
                                        .split(";"), function (item) {
                                            return item != undefined && item.trim().length > 0;
                                        });;;
    
                var settings = [];
                var j = 0;
                for (j; j < obj.settings.length; j++) {
                    var setting = obj.settings[j];
                    var item = { Name: setting.name, Code: setting.data.toUpperCase() };
                    settings.push(item);
                }
                res.Settings = settings;
    
                var updateFirmwares = [];
                j = 0;
                for (j; j < obj.updateFirmwares.length; j++) {
                    var updateFirmware = obj.updateFirmwares[j];
                    var item = {
                        Name: updateFirmware.name,
                        Display: updateFirmware.display,
                        Code: _.filter(updateFirmware.data.toUpperCase()
                                        .replace("\n", "").replace("\t", "")
                                        .split(";"), function (item) {
                                            return item != undefined && item.trim().length > 0;
                                        })
                    };
                    updateFirmwares.push(item);
                }
                res.UpdateFW = updateFirmwares;
    
                var object = { Name: obj.name, Object :res};
    
                resObj.push(object);
            }   
    
            if (compressType == COMPRESSTYPE.LZSTRING) {
                var jsonStr = JSON.stringify(resObj);
                var compressStr = LZString.compress(jsonStr);
                deferred.resolve(compressStr);
            }
            else {
                deferred.resolve(resObj);
            }
        });
        
    } catch (ex) {
        deferred.reject({ error: ex });
    }

    return deferred.promise;
}
var getTextFileAsync = function (compressType) {
   
    var ORION_TEXTFILE = "orion-textfile";
    var resObj = [];    
    var deferred = q.defer();
    
    ReadFrom().url(LINK_MAIN).then(function (linkdata) {        
        var linkdatas = linkdata.split("\r\n");
        var orion_textfile = _.find(linkdatas, function (lnkdata) { return lnkdata.indexOf(ORION_TEXTFILE) >= 0 });
        
        if (orion_textfile !== "") {
            var links = orion_textfile.split(",");
            if (links.length > 2) {
                var link = links[2];
                
                ReadFrom().url(link).then(function (data) {
                    var nameAndLinks = data.toString().split(SEPARATOR_TEXT_FILE);
                    _.each(nameAndLinks, function (nameAndLink) {
                        analyzeNameAndLink(nameAndLink).then(function (res) {
                            resObj.push(res);
                            if (resObj.length == nameAndLinks.length) {
                               
                                if (compressType == COMPRESSTYPE.LZSTRING) {
                                    var jsonStr = JSON.stringify(resObj);
                                    var compressStr = LZString.compress(jsonStr);                                   
                                    deferred.resolve(compressStr);
                                }
                                else {
                                    deferred.resolve(resObj);
                                }
                            }
                        });
                    });        
                }).catch(function (error) {
                    deferred.resolve({ error: error });
                });  
            }
        }        
    }).catch(function (error) {
        deferred.reject({ error: error });
    });


    return deferred.promise;
};

var insertFirmware = function (obj) {
    var fws = FWDB();
    var id = uuid.v4();
    //console.log("obj        " + obj);
    var string = LZString.decompressFromUTF16(obj);
    //console.log("string        " + string);
    var json = JSON.parse(string);
    //console.log("json        " + json);
    json.id = id;
    fws.insertJSON("Orion/IFC/FW/" + id, json);
    return true;
}
var updateFirmware = function (obj) {

    var string = LZString.decompressFromUTF16(obj);
    //console.log("string        " + string);
    var json = JSON.parse(string);
    //console.log("json        " + json);
    var fws = FWDB();
    console.log("jsonID        " + json.id);
    fws.updateJSON("Orion/IFC/FW/" + json.id, json);
    return true;
}
var getFirmwaresAsync = function (obj) {
    var fws = FWDB();
    var data = fws.selectJSON("Orion/IFC/FW");
    return data;
}
var settingESP = function (obj) {
    var esps = ESPDB();
    var time = (new Date()).getTime();
    var id = time;
    var item = {
        id: id,
        time: time,
        ssid: obj.ssid,
        pass: obj.pass,
        blynk: obj.blynk,
    };
    esps.push("/ESP[]", item);

}
var getESPData = function (obj) {
    var esps = ESPDB();
    var data = esps.getData("/ESP");
    return data;
}
var getESPDataFile = function (obj) {
    var esps = ESPDB();
    var data = esps.getData("/ESP");
    return data;
}
module.exports =
{
    getTextFileAsync: getTextFileAsync,
    getTextFileNewAsync: getTextFileNewAsync,
    insertFirmware: insertFirmware,
    getFirmwaresAsync: getFirmwaresAsync,
    updateFirmware: updateFirmware,
    settingESP: settingESP,
    getESPData:getESPData,
    getESPDataFile: getESPDataFile

}