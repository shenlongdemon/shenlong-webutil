
/*
 * GET users listing.
 */
var services = require("./../services/service");
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
			var result = {Data:data};
	        res.status(200).send(result);
	    }).catch(function (error) {
			res.status(500).send(error);
	    });
	}
	else{
	    console.log("controller call doget");
		var ret = services["doaction"](service, action, obj);	
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
		    var result = { Data: data };
		    console.log("controller get from dopost async");
			res.status(200).send(result);
	    }).catch(function (error) {
			res.status(500).send(error);
	    });
	}
	else{
		console.log("controller call dopost sync");
		var ret = services["doaction"](service, action, obj);	
		var result = { Data: ret };
		console.log("controller get from dopost");
        res.status(200).send(result);
	}
};

module.exports =
{	
    doget: doget,
    docusget : docusget,
	dopost : dopost
}