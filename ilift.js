// Webservices
const GET_USER = "http://"+ADDRESS+":8080/ilift/user/byUsername/"
const GET_DOUGHNUT_CHART = "http://"+ADDRESS+":8080/ilift/session/sessionCounts/"
const GET_EXERCISES = "http://"+ADDRESS+":8080/ilift/exercise/all/"
const GET_LINE_CHART = "http://"+ADDRESS+":8080/ilift/session/repetitions/"

/* Context variables defined for the charts*/
var ctxLineChart;
var ctxDoughnutChart;

/* Chart variables */
var lineChart;
var doughnutChart;

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

/*
	Doughnut chart object	
*/
function DoughnutObject(value, color, label) {
	this.value = value;
	this.color = color.mainColor;
	this.highlight = color.highlightColor;
	this.label = label
}

/* 
	Line chart object
*/
function LineObject(chartData) {
	var labels = [];
	var data = [];
	$.each(chartData, function(index, value) {
		labels.push(value.name);
		data.push(value.count);
	});
	this.labels = labels;
	this.datasets = [{
		label: "Exercise Performance",
	    fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
	    data: data
	}];
}

function createDoughnutData(chartData) {
	var data = [];
	$.each(chartData, function(index, value) {
		data.push(new DoughnutObject(value.count, colorList[index], value.name));
	});
	return data;
}

function createLineChartData(chartData) {
	var data = new LineObject(chartData);
	return data;
}

//------------------HTML MANIPULATION--------------------

/*
	Receives a session and adds a row to the session table
*/
function appendTable(session) {
	var totalRepetitions = Number(session.repetitions) + Number(session.badRepetitions);
	var performanceRate = (100 * session.repetitions / totalRepetitions).toFixed(2);
	$("#sessionsTable > tbody:last-child").append(" \
		<tr> \
			<td>"+session.date+"</td> \
			<td>"+session.exercise.name+"</td> \
			<td>"+session.equipment.type.name+" - "+session.equipment.weightKg+"Kg</td> \
			<td>"+totalRepetitions+"</td> \
			<td>"+performanceRate+" %</td> \
		</tr>"
	);
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
	Displays a message indicating that there are no sessions
*/
function displayEmptyMessage() {
	$("#sessionTableContainer").hide();
	$("#defaultContent").show();
}

/* 
	Receives a list of sessions and updates the sessions table
*/
function showSessions(sessions) {		
	$("#sessionsTable > tbody").empty();
	$("#defaultContent").hide();
	$("#sessionTableContainer").show();
	$.each(sessions, function(index, value){
		appendTable(value);
	});
}

//------------------WEBSERVICES--------------------


/*
	Gets a list of all the available exercises and fill a drop-down
	input that controls the line chart
*/
function fetchExercises() {
	$.getJSON(GET_EXERCISES, function(exercises){				
		if(exercises === null){
			showErrorMessage("Ups, no exercises available");					
		} else {
			hideErrorMessage();
			$.each(exercises, function(index, value){
				$('#exercise-list')
					.append($("<option></option>")
			        .attr("value", value)
			        .text(value));
			});			
		}
	});
}

/*
	Gets all the exercise sessions for the specified username
*/
function fetchSessions(username){
	$.getJSON(GET_USER+username, function(user){				
		if(user === null){
			showErrorMessage("The user does not exist");					
		} else {
			hideErrorMessage()					
			$("#usernameLabel").text(user.username);			
			showSessions(user.sessions);
			if(user.sessions.length == 0) {
				displayEmptyMessage();
			} else {
				fetchDoughnutChart(user.username);
				fetchLineChart(user.username, $("#exercise-list").val(), 5);				
				showSessions(user.sessions);
			}
		}
	});
}

/*
	Gets the data needed for creating the doughnut chart. The total number
	of sessions for each exercise for the given user
*/
function fetchDoughnutChart(username){
	$.getJSON(GET_DOUGHNUT_CHART+username, function(chartData){				
		if(chartData === null){
			console.log("No data for the chart");
		} else {
			$("#sessionChartContainer").show();
			
			var data = createDoughnutData(chartData);

			if(doughnutChart !== undefined) {
				doughnutChart.destroy();
			}

			ctxDoughnutChart = $("#sessionDoughnutChart").get(0).getContext("2d");
			doughnutChart = new Chart(ctxDoughnutChart).Doughnut(data, { animateScale: false });
		}
	});	
}

/*
	Gets the data needed for creating the line chart. session data for the
	indicated exercise and username. It limits the results fetched according
	to the specified limit value
*/
function fetchLineChart(username, exercise, limit) {
	$.getJSON(GET_LINE_CHART+username+"/"+exercise+"/"+limit, function(chartData){				
		if(chartData === null){
			console.log("No data for the chart");
		} else {
			$("#sessionChartContainer").show();
			$("#sessionLineChart").empty();
			
			var data = createLineChartData(chartData);

			if(lineChart !== undefined) {
				lineChart.destroy();
			}

			ctxLineChart = $("#sessionLineChart").get(0).getContext("2d");
			lineChart = new Chart(ctxLineChart).Line(data, {
			    bezierCurve: true
			});
		}
	});
}

//-------------------HANDLERS-----------------------

$(function() {

	var username;

	fetchExercises();	

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
		}
	});

	$("#exercise-list").on("change", function(){
		fetchLineChart(username, this.value, 5);
	});
})