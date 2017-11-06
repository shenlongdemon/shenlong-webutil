const http         = require('http'),
fs           = require('fs'),
path         = require('path'),
express 	   = require("express"),
bodyParser   =  require("body-parser"),      
env          = process.env,
controller   = require("./controllers/controller")
;
var app = express();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json({ limit: '5mb' }));


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static/portal'));

app.get("/", function (req, res){
	res.sendFile("/portal/index.html");
});
app.get("/service/:service/:action/:obj", controller.doget);
app.get("/cusservice/:service/:action", controller.docusget);
app.get("/cusservice/:service/:action", controller.docusget);
app.post("/service", controller.dopost);

app.get("/v1/service/:service/:action/:obj", controller.dogetv1);
app.post("/v1/service/:service/:action", controller.dopostv1);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
