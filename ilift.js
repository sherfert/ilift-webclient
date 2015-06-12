function appendTable(album) {
	$("#sessionsTable > tbody:last-child").append(" \
		<tr> \
			<td>12/06/2015</td> \
			<td>"+album.userId+"</td> \
			<td>"+album.id+"</td> \
			<td>"+album.title+"</td> \
		</tr> \
	");
}

$(function(){	
	$("#getSessions").on("click", function(e) {
		e.preventDefault();		
		$.getJSON( "http://jsonplaceholder.typicode.com/albums", function(albums) {
			$("#sessionsTable > tbody").empty();
			$.each(albums, function(index, value){				
				appendTable(value);
				console.log(value.userId);
			});
		});		
	});
})