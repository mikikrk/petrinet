/**
 * Created by Michał on 2015-06-11.
 */
 
window.buildReachabilityTree = function(){
	var allStates = [];
	var id = 1;
    var states = getAllStates();
    states.status = 'new'; states.id = [id++]; states.parent = ""; 	states.transition = "";
    allStates.push(states);
	while(findNewState(allStates)){
		var firstNewStates = findFirstNewState(allStates);
		setStates(firstNewStates);
		if(isDuplicate(firstNewStates,allStates)){
            firstNewStates.status = 'old';
            continue;
        }
		var activeTransitions = getFireableTransitions();
        if(Object.keys(activeTransitions).length === 0){
			firstNewStates.status = 'end';
		}
		for(var activeT in activeTransitions){
			playTransition(activeTransitions[activeT]);
			var currStates = getAllStates();
			if(!includeStates(currStates, allStates)){
			    currStates.transition=activeTransitions[activeT].attr(".label/text") + ';';
                currStates.status = 'new';
                currStates.id = [id++];
                currStates.parent = firstNewStates.id[0] + ';';
				var checkedStates = checkStates(currStates,allStates);
				checkInf(currStates, checkedStates);
                allStates.push(currStates);
			}else{
				var sameState = findSameState(currStates,allStates);
				allStates[sameState].transition+=activeTransitions[activeT].attr(".label/text") + ';';
				allStates[sameState].parent += firstNewStates.id[0] + ';';
			}
			setStates(firstNewStates);
		}
		if(firstNewStates.status != 'end'){
			firstNewStates.status = 'old'
		}
	}
    setStates(allStates[0]);
    return allStates;
}	

function isDuplicate(state, list){
	for(var i = 0; i < list.length; i++){
		if(sameStates(state, list[i]) && state.id != list[i].id && list[i].status != 'new'){
			return true;
		}
	}
    return false;
}

function checkStates(state,list){
    var checked = [];
	var counter = 0;
    while(state.parent[0] != undefined && counter < list.length){
        state = list[state.parent[0] - 1];
        checked.push(list[state.id[0] - 1]);
		counter++;
    }
    return checked;
}

function checkInf(state,list){
	for(var el in list){
        if(!isInf(state,list[el]) && isInf(list[el],state) && !sameStates(state,list[el])){
            for(var i = 0; i < state.length;i++){
                if(state[i] > list[el][i]){
                    state[i] = 'w';
                }
            }
        }	
	}
}

function isInf(state, list){
    for(var i = 0; i < state.length; i++){
        if(state[i] < list[i]){
           return true;
        }
    }
    return false;
}

function playTransition(transition){
	var inbound = graph.getConnectedLinks(transition, {inbound: true});
	var outbound = graph.getConnectedLinks(transition, {outbound: true});

	for(var inLink in inbound){
		var inPlace = graph.getCell(inbound[inLink].get('source'));
		var tmpTokens = inPlace.get("tokens");
		if(tmpTokens != 'w')
			inPlace.set("tokens", tmpTokens - linkValue(inbound[inLink]));
	}
	
	for(var outLink in outbound){
		var outPlace = graph.getCell(outbound[outLink].get('target'));
		var tmpTokens = outPlace.get("tokens");
		if(tmpTokens != 'w')
			outPlace.set("tokens", tmpTokens + linkValue(outbound[outLink]));
	}
}
	
function setStates(states){
    var places = getAllPlaces();
    var i = 0;
	for(var place in places){
		places[place].set("tokens", states[i++]);
	}
}
	
function findNewState(list){
	for(var i = 0; i < list.length; i++){
		if(list[i].status == 'new')
			return true;
	}
	return false;
}

function findFirstNewState(list){
	for(var i = 0; i < list.length; i++){
		if(list[i].status == 'new')
			return list[i];
	}
} 	

function getAllStates(){
	var places = getAllPlaces();
	var states = [];
	for(var place in places){
		states.push(places[place].get("tokens"));
	}
	return states;
}

function includeStates(state,list){
	for(var i in list){
		if(sameStates(state, list[i]))
			return true;
	}
	return false;
}

function findSameState(state,list){
	for(var i = 0; i < list.length; i++){
        if(sameStates(state, list[i])){
            return i;
        }
    }
    return null;
}

function sameStates(state1,state2){
    for(var i = 0; i < state1.length; i++){
        if(state1[i]!=state2[i]){
			return false;
		}
    }
    return true;
}