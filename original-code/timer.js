/**********************************************************
*										 				  
* Title    : Oracle Countdown Garage Clock 				  
* Author   : Miles Jackson				  				  
* Created  : February 23, 2023       					
* GitHub   :						    				  
*										 				  
***********************************************************/

// --UPDATE THIS FOR EACH EVENT-- Event list
// FORMAT YEAR, MONTH, DAY, HR, MIN, SEC
// Event must be in time order (soonest to latest), it just loops through until it finds an event in the future.
// Depending on time zone, you may have to adjust with an offset. Double check the first on is correct
// Should enter these events in 'local' timezone.
const EVENTS = [
    ["Curfew",	 		"2023:2:28:11:43:00"],
    ["Curfew", 			"2023:2:28:11:43:05"],
	["FP1 Start", 		"2023:2:28:11:43:10"],
	["FP2 Start", 		"2023:2:28:11:43:15"],
	["Curfew",			"2023:2:28:11:43:20"],
	["FP3 Start", 		"2023:2:28:11:43:25"],
	["Q1 Start", 		"2023:2:28:11:43:30"],
	["Saturday Covers", "2023:2:28:11:43:35"],
	["Pitlane Opens", 	"2023:2:28:11:43:40"]
];

// Adjust to the timezone by adding/subtracting this many hours
// It should pick up the computers timezone, so if the computer has updated to local, 0.0 should be local timezone.
// If the computer has not changed timezones, then you may need to adjust here +/-
const TIMEZONE_ADJUST = 0.0;

let countdown;// setInterval function for countdown clock
let serviceInSession;// seTimeout function for when event is Live
const clock = document.getElementById('clock');// div that controls the clock container 

//const daysUnit = document.querySelector('.days');// span element that displays the amount of days
const hoursUnit = document.querySelector('.hours');// span element that displays the amount of hours
const minutesUnit = document.querySelector('.minutes');// span element that displays the amount of minutes
const secondsUnit = document.querySelector('.seconds');// span element that displays the amount of seconds

// This is the local clock text
const localClock = document.querySelector('.localclocktext');// span element that displays the amount of seconds
const eventTextItem = document.querySelector('.event_name');// Text item that displays the event name
// Need to replace this with event list
let eventText = "";


const startDate = new Date(2023, 12, 31, 12, 30, 00).getTime();// initial date and time the countdown clock started from (Year, Month, Day, Hours, Minutes, Seconds,)
startDate > Date.now() ? timer(startDate) : calculateFutureDate(startDate);// conditional statement that decides if the timer function should start with the start date or calculate another date

// Get next event from list of events
function getNextEvent(now){
	//console.log("Now", now);
	for(let i = 0; i < EVENTS.length; i++){
		newEventText = EVENTS[i][0].toUpperCase();
		newEventDateList = EVENTS[i][1].split(":");
		newEventDate = new Date(newEventDateList[0], newEventDateList[1]-1, newEventDateList[2], newEventDateList[3], newEventDateList[4], newEventDateList[5]);
		console.log(newEventDate);
		timeDelta = newEventDate - now;
		console.log(timeDelta);
		if (timeDelta >= 0){
			eventText = newEventText;
			//console.log (eventText);
			return newEventDate;
		}
	}

	eventText = "NO EVENTS";
	return now;
}

function getTimeZoneAdjustedNow(){
	const now = Date.now();
	tzAdjustedNow = now + (TIMEZONE_ADJUST * 60 * 60 * 1000);
	return tzAdjustedNow;
}

// timer function takes in a date parameter in milliseconds
function timer(date){
	// countdown holds the entire timer functionality 
	countdown = setInterval(()=>{
		// Get time right now
		const now = getTimeZoneAdjustedNow();
		console.log("Now", now);
		// Get next event
		date = getNextEvent(now);
		// Delta time
		const differenceInTime = date - now;// distance between current time and future time of event
		
		// Checks timer to see if the distance is zero and if zero
		if(differenceInTime < 0){
			eventTextItem.textContent = "No More Events".toUpperCase();
			timeLeft(0);
			clearInterval(countdown);// clear timer
		}	
		timeLeft(differenceInTime);// each iteration of setInterval send updated distance to timeLeft function
	}, 1000);// every 1 second
}
// timeLeft function takes a time as a parameter in milliseconds and displays it in Days, Hours, Minutes, and Seconds
function timeLeft(time){
	// Timer clock (Delta)	
	const days = Math.floor(time /(1000 * 60 * 60 * 24));// milliseconds into days
	const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));// milliseconds into hours
	const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));// milliseconds into minutes
	const seconds = Math.floor((time % (1000 * 60)) / 1000);// milliseconds into seconds
	// conditional added to each portion of the time that will be displayed adds a zero to the front of numbers < 10
	const displayDays = `${days < 10 ? '0' : '' }${days}`;// days string that will be displayed 
	const displayHours = `${hours < 10 ? '0' : ''}${hours}`;// hours string that will be displayed
	const displayMinutes = `${minutes < 10 ? '0' : ''}${minutes}`;// minutes string that will be displayed
	const displaySeconds = `${seconds < 10 ? '0' : ''}${seconds}`;// seconds string that will be displayed
	
	// Get current time now for the local clock
	const nowlocal = getTimeZoneAdjustedNow();

	//const localDays = Math.floor(nowlocal /(1000 * 60 * 60 * 24));// milliseconds into days
	const localHours = Math.floor((nowlocal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));// milliseconds into hours
	const localMinutes = Math.floor((nowlocal % (1000 * 60 * 60)) / (1000 * 60));// milliseconds into minutes
	const localSeconds = Math.floor((nowlocal % (1000 * 60)) / 1000) + 1;// milliseconds into seconds
	// conditional added to each portion of the time that will be displayed adds a zero to the front of numbers < 10
	//const displayDays = `${days < 10 ? '0' : '' }${days}`;// days string that will be displayed 
	const displayHoursLocal = `${localHours < 10 ? '0' : ''}${localHours}`;// hours string that will be displayed
	const displayMinutesLocal = `${localMinutes < 10 ? '0' : ''}${localMinutes}`;// minutes string that will be displayed
	const displaySecondsLocal = `${localSeconds < 10 ? '0' : ''}${localSeconds}`;// seconds string that will be displayed
	
	// Updates

	// Update Local Clock time
	localClock.textContent = displayHoursLocal + ":" + displayMinutesLocal + ":" + displaySecondsLocal;
	
	// Update Event Name
	eventTextItem.textContent = eventText;

	// Update the Delta time strings individually
	hoursUnit.textContent = displayHours;
	minutesUnit.textContent = displayMinutes;
	secondsUnit.textContent = displaySeconds;
	
	
	// next line is for testing purposes
	// console.log(displayDays+" : " +displayHours+" : "+displayMinutes+" : "+displaySeconds);
}
// calculateFutureDate takes a number in milliseconds as a parameter 
function calculateFutureDate (dateTochange){	
		const newDate = new Date(dateTochange);// converts it to date format
		const weeklyDate  = newDate.setDate(newDate.getDate() +07);// adds 7 days to that date
		timer(weeklyDate);// sends it to the timer function
		//console.log("new: "+dateTochange);		
}