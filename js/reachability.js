/**
 * Created by Michał on 2015-06-11.
 */
 

window.buildReachabilityTree = function(){
	var statesList = [];
	var id = 1;
    var states = getAllStates();
    states.status = 'new';
    states.id = [id++];
	states.parent = "";
	states.transition = [];
    statesList.push(states);
	while(findNewState(statesList)){
		var firstNewStates = findFirstNewState(statesList);
		setStates(firstNewStates);
		if(isDuplicate(firstNewStates,statesList)){
            firstNewStates.status = 'old';
            continue;
        }
		var activeTransitions = getFireableTransitions();
		var trl = Object.keys(activeTransitions).length;
        if(trl === 0) firstNewStates
			.status = 'end';
		for(var activeT in activeTransitions){
			playTransition(activeTransitions[activeT]);
			var tmpStates = getAllStates();
			if(!includeStates(tmpStates, statesList)){
			    tmpStates.transition=activeTransitions[activeT].attr(".label/text") + ';';
                tmpStates.status = 'new';
                tmpStates.id = [id++];
                tmpStates.parent = firstNewStates.id[0] + ';';
				handleAccumulation(tmpStates, filterPath(tmpStates,statesList));
                statesList.push(tmpStates);
			}else{
				var sameState = findSameState(tmpStates,statesList);
				statesList[sameState].transition+=activeTransitions[activeT].attr(".label/text") + ';';
				statesList[sameState].parent += firstNewStates.id[0] + ';';
			}
			setStates(firstNewStates);
		}
		firstNewStates.status = 'old'
	}
    setStates(statesList[0]);
    return statesList;
}	

function isDuplicate(state, list){
	for(var i = 0; i < list.length; i++){
		if(areEqualStates(state, list[i]) && state.id != list[i].id && list[i].status != 'new'){
			return true;
		}
	}
    return false;
}

function filterPath(state,statesList){
    var filtered = [];
    var tmp = state;
	var counter = 0;
    while(tmp.parent[0] != undefined && counter < statesList.length){
        tmp = statesList[tmp.parent[0] - 1];
        filtered.push(statesList[tmp.id[0] - 1]);
		counter++;
    }
    return filtered;
}

function handleAccumulation(state,stateList){
    _.each(stateList,function(entry){
        if(!this.hasLowerState(state,entry) && this.hasLowerState(entry,state) && !this.areEqualStates(state,entry)){
            for(var i = 0; i<state.length;i++){
                if(state[i]>entry[i]){
                    state[i] = 'w';
                }
            }
        }
    },this);
}

function hasLowerState(state, list){
    isLower = false;
    for(var i = 0; i < state.length; i++){
        if(state[i] < list[i]){
            isLower = true;
            break;
        }
    }
    return isLower;
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
	var st = [];
	for(var place in places){
		st.push(places[place].get("tokens"));
	}
	return st;
}

function includeStates(state,statesList){
    var isDuplicate = false;
    _.each(statesList,function(entry){
        if(this.areEqualStates(state, entry)){
            isDuplicate = true;
        }
    },this);
    return isDuplicate;
}

function findSameState(state,statesList){
	for(var i = 0; i < statesList.length; i++){
        if(this.areEqualStates(state, statesList[i])){
            return i;
        }
    }
    return null;
}

function areEqualStates(state1,state2){
    var equal=true;
    for(var i = 0; i<state1.length; i++){
        if(state1[i]!=state2[i]){
            equal=false;
            break;
        }
    }
    return equal;
}