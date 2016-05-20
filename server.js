//Load node.js modules
var express = require('express'); //Require the Express Module
var cors = require('cors'); // The cors module allows a site that is not in the localhost domain to send a request
//Runs every time a request is recieved
function logger(req, res, next) {
    console.log('Request from: ' + req.ip + ' For: ' + req.path); //Log the request to the console
    next(); //Run the next handler (IMPORTANT, otherwise your page won't be served)
}
var port = 8000;
var btSpheros = ["","","",""];
var btSpherConn = ['','','',''];
var numSpherosAvail = 0;
var numSpherosConnected = 0;

require('shelljs/global');

var command = exec("./getSpheros");
if(command.stderr != undefined && command.stderr != ""){
	command = exec("getSpheros.exe");
}
var lines = command.output.split(';');

for(i=0; i<lines.length-1; i++){
	var parts = lines[i].split(' ');
	btSpheros[numSpherosAvail] = parts[0] +'#'+ parts[1];
	numSpherosAvail += 1;	
}


//Configure the settings of the app
var app = express(); //Initialize the app
app.use(logger); //Tells the app to send all requests through the 'logger' function

app.get('/code', cors(), function(req,res){
	var filename = req.query.filename;
	var fs = require('fs');
	var code = fs.readFileSync(filename, req.query.code, 'utf8');
	res.write(code);
	res.end(req.body);
});

app.get('/ajax', cors(), function(req, res) {
	console.log("Posted to ajax from: " + req.ip);
	res.setHeader('Content-Type', 'text/plain'); //Tell the client you are sending plain text
	require('shelljs/global');

	var opcode = req.query.op;
	if(opcode == 1){
		//Give available spheros
		var result = "";
		for(i=0; i<numSpherosAvail; i++){
			result += btSpheros[i] + ';';
		}
		console.log("Request for spheros");
		res.write(result);
		res.end(req.body);
	}
	else if(opcode == 2){
		//Connect to chosen sphero
		var sphero = req.query.spheroSelected;
		
		var sSel = 999;
		for(i=0; i<numSpherosAvail; i++){
			if(btSpheros[i].search(sphero) != -1){
				sSel = i;
			}
		}
		
		if(sSel == 999){
			res.write("Invalid sphero selected");
			res.end(req.body);
		}
		else{
			res.write("Valid Sphero selected and ready to program");
			res.end(req.body);
		}
	}
	else if(opcode == 3){
		//Run program given
		var status;
		if(req.query.difficulty == 0){		
			status = parserEasy(req.query.code);
		}
		else{
			status = parserMedorHard(req.query.code);
		}
		if(status != ""){
			console.log(status);
			res.write("ERROR: " + status + "\nProgram not uploaded");
			res.end(req.body);	
		}
		else{
			var fs = require('fs');
			fs.writeFileSync('./student.js', req.query.code, 'utf8');
			res.write("Successful upload of code");
			res.end(req.body);
		}
	}
	else if(opcode == 4){
		var command = exec("node driver.js student.js " + req.query.spheroPort.trim(), {silent:true});
		if(command.stderr != undefined && command.stderr.search("new error") == -1){
			res.write(command.stderr);
			res.end(req.body);
		}
		else{
			res.write("Success probably");
			res.end(req.body);
		}
	}
});

function parserEasy(code){
	var lines = code.split('\n');
	var distFound = false, timeFound = false, rateFound = false, stopFound = false;
	var locTime, locDist, locRate, locStop;
	for(i=0; i< lines.length; i++){
		var temp = lines[i].search("var distance")
		if(temp != -1 && !distFound){
			locDist = i;
			distFound = true;
			continue;
		}
		temp = lines[i].search("var time");
		if(temp != -1 && !timeFound){
			locTime = i;
			timeFound = true;
			continue;
		}
		temp = lines[i].search("var rate");
		if(temp != -1 && !rateFound){
			locRate = i;
			rateFound = true;
			continue;
		}
		temp = lines[i].search("var stop");
		if(temp != -1 && !stopFound){
			locStop = i;
			stopFound = true;
			continue;
		}
	}
	var retVal = "";
	if(locDist != undefined && lines[locDist].search("=") == -1){
		retVal += "Distance Variable not set\n";
	}
	if(locRate != undefined && lines[locRate].search("=") == -1){
		retVal += "Rate Variable not set\n";
	}
	if(locTime != undefined && lines[locTime].search("=") == -1){
		retVal += "Time Variable not set\n";
	}
	if(locStop != undefined && lines[locStop].search("=") == -1){
		retVal += "Stop Variable not set";
	}
	return retVal;
	

}

function parserMedorHard(code){
	var lines = code.split('\n');
	var distFound = false, timeFound = false, rateFound = false;
	var locTime, locDist, locRate;
	for(i=0; i< lines.length; i++){
		var temp = lines[i].search("var distance")
		if(temp != -1 && !distFound){
			locDist = i;
			distFound = true;
			continue;
		}
		temp = lines[i].search("var time");
		if(temp != -1 && !timeFound){
			locTime = i;
			timeFound = true;
			continue;
		}
		temp = lines[i].search("var rate");
		if(temp != -1 && !rateFound){
			locRate = i;
			rateFound = true;
			continue;
		}
	}
	var retVal = "";
	if(lines[locDist].search("=") == -1){
		retVal += "Distance Variable not set\n";
	}
	if(lines[locRate].search("=") == -1){
		retVal += "Rate Variable not set\n";
	}
	if(lines[locTime].search("=") == -1){
		retVal += "Time Variable not set";
	}
	return retVal;
}


app.listen(port); //Listen on the specified port
console.log('Listening on port ' + port); //Write to the console