/* Run this driver on command line with: 
 *
 *	   node driver.js user.js PRY 
 *
 * where PRY is the three colors the Sphero flashes (Purple Red Yellow)
*/
	var userfile = process.argv[2];			      // Get student's js file
	var port = process.argv[3];				        // Get port based on color


	var Cylon = require('cylon');		

	Cylon.robot({
	  connections: {
		// If this port doesn't work, run "ls /dev/*Sphero*" to find your port
		sphero: { adaptor: 'sphero', port: port}
	  },

	  devices: {
		sphero: { driver: 'sphero' }
	  },

	  work: function(my) {
		// Start calibration so students can aim sphero
		my.sphero.color('yellow');
		console.log("Starting Calibration...");
		my.sphero.startCalibration();
		// After starting calibration, wait 2 seconds, start flashing, and end
		setTimeout(function(){
		  setTimeout(function(){
			setTimeout(function(){
			  setTimeout(function(){
				// End calibration and execute user code
				console.log("Ending calibration...");
				my.sphero.color('green');
				 // Include it here
				my.sphero.finishCalibration(function(){
					var studentCode = require("./student.js");
					studentCode.execute(my); // After connecting to Sphero, execute the student's code
				});
			  }, 500);
			  my.sphero.color('red');
			}, 500);
			  my.sphero.color('yellow');
		  }, 500);
			  my.sphero.color('red');
		}, 2000);
	  }
	}).start();
	console.log("potatoes");