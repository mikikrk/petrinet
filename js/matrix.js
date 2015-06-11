/**
 * Created by Michał on 2015-05-23.
 */
 
 
 window.buildMatrixRepresentation = function(){
	var numberOfTransitions = Object.keys(getAllTransitions()).length;
	var numberOfPlaces = Object.keys(getAllPlaces()).length;
	
	var places = getAllPlaces();
	
	var matrixDm = new Array(numberOfPlaces);
	for (var i = 0; i < numberOfPlaces; i++) {
		matrixDm[i] = new Array(numberOfTransitions);
	}
	var matrixDp = new Array(numberOfPlaces);
	for (var i = 0; i < numberOfPlaces; i++) {
		matrixDp[i] = new Array(numberOfTransitions);
	}
	for (var i = 0; i < numberOfPlaces; i++) {
		for (var j = 0; j < numberOfTransitions; j++) {
			matrixDm[i][j] = 0;
			matrixDp[i][j] = 0;
		}
	}
	
	
	var transitions = getAllTransitions();
	var transitionCounter = 0;
	
	for(var transition in transitions){
		var inbounds = graph.getConnectedLinks(transitions[transition], {inbound: true});
		for(var inbound in inbounds){
			var placeCounter = 0;
			for(var place in places){
				if(graph.getCell(inbounds[inbound].get('source')) == places[place]){
				matrixDm[placeCounter][transitionCounter] = 1;
				}
				placeCounter++;
			}
		}
		placeCounter = 0;
		
		var outbounds = graph.getConnectedLinks(transitions[transition], {outbound: true});
		for(var outbound in outbounds){
			var placeCounter = 0;
			for(var place in places){
				if(graph.getCell(outbounds[outbound].get('target')) == places[place]){
					matrixDp[placeCounter][transitionCounter] = 1;
				}
				placeCounter++;
			}
		}
		transitionCounter++;
	}

	var matrixD = new Array(numberOfPlaces);
	for (var i = 0; i < numberOfPlaces; i++) {
		matrixD[i] = new Array(numberOfTransitions);
	}
	
	for (var i = 0; i < numberOfPlaces; i++) {
		for (var j = 0; j < numberOfTransitions; j++) {
			matrixD[i][j] = matrixDp[i][j] - matrixDm[i][j];

		}
	}

	 displayMatrix($('#matrix #dm'), matrixDm);
	 displayMatrix($('#matrix #dp'), matrixDp);
	 displayMatrix($('#matrix #d'), matrixD);

 }

function displayMatrix($div, matrix){
	var $table = $div.children('table');
	$table.empty();
	for (var i = 0; i < matrix.length; i++){
		var $tr = $("<tr>");
		for (var j = 0; j < matrix[i].length; j++){
			var $td = $("<td>");
			$td.append(matrix[i][j]);
			$tr.append($td);
		}
		$table.append($tr);
	}
}