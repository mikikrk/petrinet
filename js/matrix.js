/**
 * Created by Michał on 2015-05-23.
 */
 
 
 function buildMatrixRepresentation(){
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
	
	var transitions = getAllTransitions();
	
	for(var transition in transitions){
		var inbounds = graph.getConnectedLinks(transitions[transition], {inbound: true});
		var transitionCounter = 0;
		for(var inbound in inbounds){
			var placeCounter = 0;
			for(var place in places){
				if(graph.getCell(inbounds[inbound].get('source')) == places[place]){
					matrixDm[transitionCounter][placeCounter] = 1;
				}else{
					matrixDm[transitionCounter][placeCounter] = 0;
				}	
				placeCounter++;
			}
			transitionCounter++;
		}
		transitionCounter = 0;
		placeCounter = 0;
		
		var outbounds = graph.getConnectedLinks(transitions[transition], {outbound: true});
		for(var outbound in outbounds){
			var placeCounter = 0;
			for(var place in places){
				if(graph.getCell(outbounds[outbound].get('target')) == places[place]){
					matrixDp[transitionCounter][placeCounter] = 1;
				}else{
					matrixDp[transitionCounter][placeCounter] = 0;
				}	
				placeCounter++;
			}
			transitionCounter++;
		}

	}
 }