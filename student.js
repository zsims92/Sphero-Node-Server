/*
 * Sphero Code
 * 
 * DO NOT DELETE any of the given code. Doing so may cause your 
 * program to fail! Simply follow the instructions provided by 
 * the comments to complete this program.
 * 
 * Simply find the parts of code that say TODO: and follow the
 * instructions below
 */
exports.execute = function(my){

    // TODO:
    // -------- DISTANCE FORMULA -------- 
    // Assign a known value to the two known variables and
    // use the distance formula to solve for the unknown variable 

    // NOTE: If you use one variable in a formula for another
    //      make sure to define that one before the other

    var distance=200;  // The distance is in centimeters
    var time=2;       // The time is in seconds
    var rate=distance/time;       // The rate is in centimeters per second
    /* EX: Unknown Rate
        var distance = 100;				// cm
    	var 	time = 1;				// s
    	var     rate = distance / time; // cm / sec
	*/



    // -------- SPHERO COMMANDS -------- 
    // Leave this code alone. It will drive your Sphero forward for
    // the amount of seconds in the 'time' variable
    var heading = 0;
    my.sphero.setMotionTimeout(time * 1000 + 1000);
    my.sphero.roll(rate, heading, function(){
        afterRoll(my, time);
    });
    return time;
}

/*
 * This function is used to wait a given amount of time after
 * the Sphero has begun rolling.
 */
function afterRoll(my, time){
    // Calculate milliseconds
    var milliseconds = time * 1000;
    var start = new Date().getTime(); // Current time in milliseconds

    // -------- LOOP --------
    while(true){
        var current = new Date().getTime(); // Current time in milliseconds

        // TODO:
        // Change the stop variable to be true when the elapsed 
        // time is greater than or equal to milliseconds
        var stop = current-start>=milliseconds;
        
        // If stop is true (we've reached the amount of time
        // the Sphero should run), break out of the loop
        if(stop){
            break;
        }
    }


    // -------- HALT --------
    // Leave this code alone! It will change your Sphero to be red,
    // stop it's rolling, and disconnect it.
      my.sphero.color('red', function(){
          throw new error("Done running\n");
      });
}
