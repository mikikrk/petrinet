/**
 * Created by Michał on 2015-05-23.
 */
 
 
 window.buildMatrixRepresentation = function(){
	var numberOfTransitions = Object.keys(getAllTransitions()).length;
	var numberOfPlaces = Object.keys(getAllPlaces()).length;
	
	var places = getAllPlaces();
	
	var matrixDm = new Array(numberOfTransitions);
	for (var i = 0; i < numberOfTransitions; i++) {
		matrixDm[i] = new Array(numberOfPlaces);
	}
	var matrixDp = new Array(numberOfTransitions);
	for (var i = 0; i < numberOfTransitions; i++) {
		matrixDp[i] = new Array(numberOfPlaces);
	}
	for (var i = 0; i < numberOfTransitions; i++) {
		for (var j = 0; j < numberOfPlaces; j++) {
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
					matrixDm[transitionCounter][placeCounter] = 1;
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
					matrixDp[transitionCounter][placeCounter] = 1;
				}
				placeCounter++;
			}
		}
		transitionCounter++;
	}
	
	
	var matrixD = new Array(numberOfTransitions);
	for (var i = 0; i < numberOfTransitions; i++) {
		matrixD[i] = new Array(numberOfPlaces);
	}
	
	for (var i = 0; i < numberOfTransitions; i++) {
		for (var j = 0; j < numberOfPlaces; j++) {
			matrixD[i][j] = matrixDp[i][j] - matrixDm[i][j];

		}
	}
 }