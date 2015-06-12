const GET_SESSIONS_BY_USER_ID = "http://130.83.110.244:8080/ilift/session/byUserId/";

function appendTable(session) {
	$("#sessionsTable > tbody:last-child").append(" \
		<tr> \
			<td>"+session.date+"</td> \
			<td>"+session.exercise.name+"</td> \
			<td>"+session.equipment.item+" "+session.equipment.weight+"</td> \
			<td>"+3+"</td> \
		</tr> \
	");
}

$(function(){	
	$("#getSessions").on("click", function(e) {
		e.preventDefault();
		var userId = $("#userId").val();
		if(!userId){
			$(".alert-submit").show();
			$("#userId").parent().addClass("has-error");
			console.log("Empty");
		} else {
			$(".alert-submit").hide();
			$("#userId").parent().removeClass("has-error");
			$.getJSON(GET_SESSIONS_BY_USER_ID+userId, function(sessions) {
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
			});
		}
	});
})