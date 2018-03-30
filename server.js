var app   = require('express')();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var path = require("path");
var url = require("url");
var YQL = require('yql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

	
app.get('/locations/*',function(req,res){
	var list = {
		"temperature":"",
		"scale":"Fahrenheit"
	};
	var str = path.basename(req.originalUrl).substr(0,5);
	var string = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where placetype='Zip' AND text='" + str + "')";
	var query = new YQL(string);
	if((path.basename(req.originalUrl).indexOf("Celsius") > -1 )|| (path.basename(req.originalUrl).indexOf("celsius") > -1)){
		list["scale"]= "Celsius";
		query.exec(function(err, data) {
			var condition = data.query.results.channel.item.condition;
			list["temperature"]= Number((condition.temp - 32)/1.8).toFixed(0);
			res.json(list);
		});
	}
	else{
		query.exec(function(err, data) {
			var condition = data.query.results.channel.item.condition;
			list["temperature"]= condition.temp;
			res.json(list);
		});
	}
});

http.listen(8080,function(){
	console.log("Connected & Listen to port 8080");
});