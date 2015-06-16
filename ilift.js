// Change this IP according to where the webservices are located
const ADDRESS = "130.83.104.42";

// Webservices
const GET_USER = "http://"+ADDRESS+":8080/ilift/user/byUsername/"
const GET_SESSIONS_BY_USER_ID = "http://"+ADDRESS+":8080/ilift/session/byUserId/";

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


$(function() {

	/* Invokes a web service with the username indicated by the user.
	   if the username is valid (non empty and existing in the database),
	   then it fetches all the sessions from that user.
	 */
	$("#getSessions").on("click", function(e) {
		e.preventDefault();
		var username = $("#username").val();
		if(!username){
			showErrorMessage("Don't forget your username!");
		} else {			
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
	});
})