
/*
 * GET users listing.
 */
var services = require("./../services/service");
var version = "Add version when return data" + "" ;

var doget = function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');


	var service = req.params.service.toLowerCase();
	var action = req.params.action;
	var obj = req.params.obj;	
	var async = false;
	if(action.toLowerCase().endsWith('async')){
		async = true;
	}
	console.log("controller call doget " + service + "/" + action + "/" + obj + "  with async = " +  async);
	if(async == true){
		console.log("controller call doget async");
	    services["doaction"](service, action, obj).then(function (data) {
	        console.log("controller get from doget async");
			var result = {
				Data: data,
				Version: version
			};
	        res.status(200).send(result);
	    }).catch(function (error) {
			res.status(500).send(error);
	    });
	}
	else{
	    console.log("controller call doget");
		var ret = services["doaction"](service, action, obj);	
		var result = { 
			Data: ret ,
			Version: version
		};
		console.log("controller get from doget");
        res.status(200).send(result);
	}
};
var docusget = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');


    var service = req.params.service.toLowerCase();
    var action = req.params.action;
    console.log("controller docusget param : " + JSON.stringify(req.query));
    var async = false;
    if (action.toLowerCase().endsWith('async')) {
        async = true;
    }
    console.log("controller call docusget " + service + "/" + action  + "  with async = " + async);
    if (async == true) {
        console.log("controller call docusget async");
        services["doaction"](service, action, req.query).then(function (data) {
            console.log("controller get from docusget async");
            var result = { Data: data };
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(500).send(error);
        });
    }
    else {
        console.log("controller call docusget");
        var ret = services["doaction"](service, action, req.query);
        var result = { Data: ret };
        console.log("controller get from doget");
        res.status(200).send(result);
    }
};


var docusget = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');


    var service = req.params.service.toLowerCase();
    var action = req.params.action;
    console.log("controller docusget param : " + JSON.stringify(req.query));
    var async = false;
    if (action.toLowerCase().endsWith('async')) {
        async = true;
    }
    console.log("controller call docusget " + service + "/" + action  + "  with async = " + async);
    if (async == true) {
        console.log("controller call docusget async");
        services["doaction"](service, action, req.query).then(function (data) {
            console.log("controller get from docusget async");
            var result = { Data: data };
            res.status(200).send(result);
        }).catch(function (error) {
            res.status(500).send(error);
        });
    }
    else {
        console.log("controller call docusget");
        var ret = services["doaction"](service, action, req.query);
        var result = { Data: ret };
        console.log("controller get from doget");
        res.status(200).send(result);
    }
};
var dopost = function(req, res){
	console.log("controller call dopost " + req);
	var body = req.body;	
	var service = body.service.toLowerCase();
	var action = body.action;
	var obj = body.obj;	
	res.setHeader('Access-Control-Allow-Origin','*');	
	var async = false;
	if(action.toLowerCase().endsWith('async')){
		async = true;
	}
	console.log("controller call dopost " + service + "/" + action + "/" + obj + "  with async = " +  async);
	if(async == true){
		console.log("controller call dopost async");
		services["doaction"](service, action, obj).then(function (data) {
		    var result = {
				Data: data ,
				Version: version
			};
		    console.log("controller get from dopost async");
			res.status(200).send(result);
	    }).catch(function (error) {
			var result = {
				Data: error,
				Message: error,
				Success: 0
			};
			res.status(200).send(result);
	    });
	}
	else{
		console.log("controller call dopost sync");
		var ret = services["doaction"](service, action, obj);	
		var result = { 
			Data: ret ,
			Version: version
		};
		console.log("controller get from dopost");
        res.status(200).send(result);
	}
};





var dogetv1 = function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
	var service = req.params.service.toLowerCase();
	var action = req.params.action;
	var obj = req.params.obj;	
	var async = false;
	if(action.toLowerCase().endsWith('async')){
		async = true;
	}
	console.log("controller call doget " + service + "/" + action + "/" + obj + "  with async = " +  async);
	if(async == true){
		console.log("controller call doget async");
	    services["doaction"](service, action, obj).then(function (data) {
	        console.log("controller get from doget async");
			var result = {
				Data: data,
				Message: "",
				Success: 1
			};
	        res.status(200).send(result);
	    }).catch(function (error) {
			var result = {
				Data: error,
				Message: error,
				Success: 0
			};
			res.status(200).send(result);
	    });
	}
	else{
		try {
			console.log("controller call doget");
			var ret = services["doaction"](service, action, obj);	
			var result = { 
				Data: ret ,
				Version: version
			};
			console.log("controller get from doget");
			res.status(200).send(result);
		}
		catch(ex){
			var result = {
				Data: ex,
				Message: ex,
				Success: 0
			};
			res.status(200).send(result);
		}
	}
};
var dopostv1 = function(req, res){
	console.log("controller call dopostv1 " + req);
	var service = req.params.service.toLowerCase();
	var action = req.params.action;

	var obj = req.body;	
	res.setHeader('Access-Control-Allow-Origin','*');	
	var async = false;
	if(action.toLowerCase().endsWith('async')){
		async = true;
	}
	console.log("controller call dopostv1 " + service + "/" + action + "/" + obj + "  with async = " +  async);
	if(async == true){
		console.log("controller call dopostv1 async");
		services["doaction"](service, action, obj).then(function (data) {
		    var result = {
				Data: data,
				Message: "",
				Success: 1
			};
		    console.log("controller get from dopostv1 async");
			res.status(200).send(result);
	    }).catch(function (error) {
			var result = {
				Data: error,
				Message: error,
				Success: 0
			};
			res.status(200).send(result);
	    });
	}
	else{
		console.log("controller call dopostv1 sync");
		try {
			var ret = services["doaction"](service, action, obj);	
			var result = { 
				Data: ret ,
				Version: version
			};
			console.log("controller get from dopost");
			res.status(200).send(result);
		}
		catch(ex){
			var result = {
				Data: ex,
				Message: ex,
				Success: 0
			};
			res.status(200).send(result);
		}
	}
};
module.exports =
{	
    doget: doget,
    docusget : docusget,
	dopost : dopost,

	// v1 : apply for new call API
	dogetv1: dogetv1,
	dopostv1 : dopostv1
}