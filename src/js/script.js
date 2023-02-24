var hourHead = document.querySelector('.hours');
var minuteHead = document.querySelector('.minutes');
var secondHead = document.querySelector('.seconds');
var secondCard = document.querySelector('#second');
var minuteCard = document.querySelector('#minute');
var hourCard = document.querySelector('#hour');


let hours;
let minutes;
let seconds;

//
console.log(seconds);
var countDownDate = new Date ("Jan 1, 2024 00:00:00").getTime();

console.log(countDownDate);

var x = setInterval(function(){

//get today's date and time
var now = new Date().getTime();

// find the distance between now and future dates
var distance = countDownDate - now;

// time calculations for days , hours, minutes , and seconds
hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
minutes = Math.floor((distance % (1000*60*60))/(1000*60));
seconds= Math.floor((distance % (1000*60))/(1000));
hourHead.innerHTML = hours;
minuteHead.innerHTML = minutes;
secondHead.innerHTML = seconds;
secondHead.addEventListener('onChange',()=>{
secondCard.classList.add('active');
})

// if countdown is over
if(distance<0){
hourHead.innerText = "PI";
minuteHead.innerText = 'R';
secondHead.innerText = 'ED';
}
},1000);
var y = setInterval(function(){
 secondCard.classList.toggle('active')
}, 1000);

var now = new Date().getTime();

// find the distance between now and the future date;
var distance = countDownDate-now;

//time calculations for days, hours, minutes and seconds
hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
minutes = Math.floor((distance % (1000*60*60))/(1000*60));
seconds= Math.floor((distance % (1000*60))/(1000));
console.log(minuteCard);
var a =  setInterval(function() {
    if (seconds<1) {minuteCard.classList.toggle('active')}
}, 1000);

var b =  setInterval(function() {
    if (minutes<1) {hourCard.classList.toggle('active')}
}, 1000);
document.getElementById("Countdown").innerHTML = (countDownDate);

function currentTimeF() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    document.getElementById("Countdown").innerHTML = time;
  }