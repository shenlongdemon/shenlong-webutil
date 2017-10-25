const http         = require('http'),
fs           = require('fs'),
path         = require('path'),
express 	   = require("express"),
bodyParser   =  require("body-parser"),      
env          = process.env,
controller   = require("./controllers/controller")
;
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/static/portal'));

// views is directory for all template files
app.set('views', __dirname + '/views');


app.get("/", function (req, res){
	res.sendFile("/portal/index.html");
});
app.get("/service/:service/:action/:obj", controller.doget);
app.get("/cusservice/:service/:action", controller.docusget);
app.get("/cusservice/:service/:action", controller.docusget);
app.post("/service", controller.dopost);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
