
/*
 * GET users listing.
 */
var request	= require('request');
var q	= require('q');
var MAP_ROUTE_API = "https://maps.googleapis.com/maps/api/directions/json?origin={0},{1}&destination={2},{3}&amp;sensor=false";

var decodePoly = function(encoded){
	console.log('decodePoly = ' + encoded);
	var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len)
    {
        var b, shift = 0, result = 0;
        do
        {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do
        {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        var p = {};
        p.Latitude = lat / 1E5;
        p.Longitude = lng / 1E5;
        poly.push(p);
    }
    var polyStr = JSON.stringify(poly);
    console.log('decodePoly = ' + encoded + " success with poly = " + polyStr);
    return poly;
};
var getPoints = function(url){
	console.log('googlemap getPoints from url = ' + url);
	var deferred = q.defer();
	var options = {
        method: 'GET',
        url: url,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };
    request(options, function(error, response, body) {
        if (error) {
        	deferred.reject(error);
        } else {        	
        	body = JSON.parse(body);
        	var jLegs = [];
        	var jSteps = {};
        	var routes = [];        	
        	var jRoutes = body.routes;
        	console.log('jRoutes size = ' + jRoutes.length);
        	
        	var i = 0;
        	for (i = 0; i < jRoutes.length; i++)
            {
                jLegs = jRoutes[i].legs;
                console.log('jLegs size = ' + jLegs.length);
                var path = [];
                
                ///** Traversing all legs */
                var j = 0;
                for (j = 0; j < jLegs.length; j++)
                {
                    jSteps = jLegs[j].steps;

                    //    /** Traversing all steps */
                    var k = 0;
                    for (k = 0; k < jSteps.length; k++)
                    {
                        var polyline = "";
                        polyline = jSteps[k].polyline.points;
                        var list = decodePoly(polyline);

                        //        /** Traversing all points */
                        var l = 0;
                        for (l = 0; l < list.length; l++)
                        {
                            var loc = {};
                            loc.Latitude = list[l].Latitude;
                            loc.Longitude = list[l].Longitude;
                            path.push(loc);
                        }
                    }
                    routes.push(path);
                }
            }        	
        	deferred.resolve(routes);
        }
    });
    return deferred.promise;
};
    	

var getRoutesAsync = function(obj){    	
	var FromLat = obj.From.Latitude;
	var FromLng = obj.From.Longitude;
	var ToLat = obj.To.Latitude;
	var ToLng = obj.To.Longitude;
	var url = MAP_ROUTE_API;
	url = url.replace('{0}', FromLat);
	url = url.replace('{1}', FromLng);
	url = url.replace('{2}', ToLat);
	url = url.replace('{3}', ToLng);
	
	
	return getPoints(url)
				.then(function (routes) {
					return routes;
			    }).catch(function (error) {				        
			    });;
};


module.exports =
{	
	getRoutesAsync : getRoutesAsync
}