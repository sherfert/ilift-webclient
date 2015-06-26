// Change this IP according to where the webservices are located
const ADDRESS = "192.168.43.245";

// Webservices
const GET_USER = "http://"+ADDRESS+":8080/ilift/user/byUsername/"
const GET_DOUGHNUT_CHART = "http://"+ADDRESS+":8080/ilift/session/sessionCounts/"
const GET_SESSIONS_BY_USER_ID = "http://"+ADDRESS+":8080/ilift/session/byUserId/";

// Colors
function Color (mainColor, highlightColor) {
    this.mainColor = mainColor;
    this.highlightColor = highlightColor;    
}

const blueColor   = new Color("#0A2F83", "#144DCF");
const yellowColor = new Color("#C48300", "#FFAA00");
const redColor	  = new Color("#8F006F", "#D700A8");
const greenColor  = new Color("#8FBB00", "#BEF800");

const colorList = [blueColor, yellowColor, redColor, greenColor];

// Doughnut chart object
function DoughnutObject(value, color, label) {
	this.value = value;
	this.color = color.mainColor;
	this.highlight = color.highlightColor;
	this.label = label
}

function createDoughnutData(chartData) {
	var data = [];
	$.each(chartData, function(index, value){
		data.push(new DoughnutObject(value.count, colorList[index], value.name));
	});
	return data;
}

var data2 = {
    labels: ["", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, null, 40, null, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};


//------------------HTML MANIPULATION--------------------

/*
	Receives a session and adds a row to the session table
*/
function appendTable(session) {
	$("#sessionsTable > tbody:last-child").append(" \
		<tr> \
			<td>"+session.date+"</td> \
			<td>"+session.exercise.name+"</td> \
			<td>"+session.equipment.type.name+" - "+session.equipment.weightKg+"Kg</td> \
			<td>"+session.repetitions+"</td> \
		</tr> \
	");
}

/* 
	Receives a message and displays it in the error container
 */
function showErrorMessage(message) {
	$(".alert-submit").text(message);
	$(".alert-submit").show();
	$("#username").parent().addClass("has-error");
}

/*
	Hides the error container
*/
function hideErrorMessage(){
	$(".alert-submit").hide();
	$("#username").parent().removeClass("has-error");
}

/* 
	Receives a list of sessions and updates the sessions table
*/
function showSessions(sessions) {	
	if(sessions.length == 0){
		$("#sessionTableContainer").hide();
		$("#defaultContent").show();
	} else {					
		$("#sessionsTable > tbody").empty();
		$("#defaultContent").hide();
		$("#sessionTableContainer").show();
		$.each(sessions, function(index, value){
			appendTable(value);
		});
	}	
}

//------------------WEBSERVICES--------------------

function fetchSessions(username){
	$.getJSON(GET_USER+username, function(user){				
		if(user === null){
			showErrorMessage("The user does not exist");					
		} else {
			hideErrorMessage()					
			$("#usernameLabel").text(user.username);			
			showSessions(user.sessions);
		}
	});
}

function fetchDoughnutChart(username){
	$.getJSON(GET_DOUGHNUT_CHART+username, function(chartData){				
		if(chartData === null){
			console.log("No data for the chart");
		} else {
			$("#sessionChartContainer").show();
			
			var data = createDoughnutData(chartData);

			var ctx = $("#sessionDoughnutChart").get(0).getContext("2d");
			var sessionDoughnutChart = new Chart(ctx).Doughnut(data, { animateScale: false });
		}
	});
	

	// var ctx2 = $("#sessionLineChart").get(0).getContext("2d");
	// var sessionLineChart = new Chart(ctx2).Line(data2, {
	//     bezierCurve: true
	// });
}

//-------------------HANDLERS-----------------------

$(function() {

	var username;	

	/* Invokes a web service with the username indicated by the user.
	   if the username is valid (non empty and existing in the database),
	   then it fetches all the sessions from that user.
	 */
	$("#getSessions").on("click", function(e) {
		e.preventDefault();
		username = $("#username").val();
		if(!username){
			showErrorMessage("Don't forget your username!");
		} else {
			fetchSessions(username);
			fetchDoughnutChart(username);
		}
	});
})