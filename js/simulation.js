/**
 * Created by Mikolaj on 2015-05-02.
 */
$(document).ready(function(){

    $('#start-simulation').click(function(){
        $(this).attr('disabled', 'disabled');
        $('#stop-simulation').removeAttr('disabled');
        $('#pause-simulation').removeAttr('disabled');
        startSimulation();
    });

    $('#stop-simulation').click(function(){
        stopSimulation();
        turnOffChoosing();
    });

    function changeButtonsAfterStopSimulation (){
        $('#stop-simulation').attr('disabled', 'disabled');
        $('#start-simulation').removeAttr('disabled');
        $('#pause-simulation').attr('disabled', 'disabled');
        $('#resume-simulation').attr('disabled', 'disabled');
    }

    $('#pause-simulation').click(function(){
        $(this).attr('disabled', 'disabled');
        $('#resume-simulation').removeAttr('disabled');
        pauseSimulation();
    });

    $('#resume-simulation').click(function(){
        $(this).attr('disabled', 'disabled');
        $('#pause-simulation').removeAttr('disabled');
        resumeSimulation();
    });
	
    var simulationStopped = true;
    var wait4choose = false;

    function startSimulation(){
        simulationStopped = false;
        simulate();
    }

    function stopSimulation(){
        changeButtonsAfterStopSimulation();
        simulationStopped = true;
    }

    function turnOffChoosing(){
        markTransitions(fireableTransitions, '#000000');
        resetPointerDblClick();
    }

    function pauseSimulation(){
        simulationStopped = true;
    }

    function resumeSimulation(){
        startSimulation();
    }

    window.resimulateIfNecessary = function(){
        if (wait4choose) {
            turnOffChoosing();
            simulate();
        }
    }

    function simulate() {
        if (!simulationStopped){
            if (validate()) {
                var fireableTransitions = getFireableTransitions();
                if (Object.keys(fireableTransitions).length === 0) {
                    stopSimulation();
                    alert("Simulation has been ended\nThere are no ways to move token");
                } else if (Object.keys(fireableTransitions).length === 1) {
                   // fireTransition(fireableTransitions[Object.keys(fireableTransitions)[0]]);
				    chooseAndFireTransition(fireableTransitions);
                } else {
                    chooseAndFireTransition(fireableTransitions);
                }
            } else {
                stopSimulation();
            }
        }
    }

    function validate(){
        var valid = validateLinks();
        if (!valid) { return valid }
        valid = validateTransitions();
        return valid;
    }

    function validateLinks(){
        var allLinks = graph.getLinks();
        for (var linkId in allLinks){
            var link = allLinks[linkId];
            if (!isConnected(link) && !isNotConnected(link)){
                alert("Links have to be connected at both sides");
                return false;
            }
        }
        return true;
    }

    function isConnected(link){
        return (link.get('source').id && link.get('target').id);
    }

    function isNotConnected(link){
        return (!link.get('source').id && !link.get('target').id);
    }

    function validateTransitions(){
        var allTransitions = getAllTransitions();
        if (Object.keys(allTransitions).length === 0){
            alert("Transitions are necessary to simulate");
            return false;
        }
        for (var tId in allTransitions){
            var transition = allTransitions[tId];
            var inbounds = graph.getConnectedLinks(transition, {inbound: true});
            var outbounds = graph.getConnectedLinks(transition, {outbound: true});
            if (!((inbounds.length!==0 && outbounds.length!==0) || (inbounds.length===0 && outbounds.length===0))){
                alert("Transitions has to have both inbounds and outbounds");
                return false;
            }
        }
        return true;
    }

    window.getAllTransitions = function(){
        var elements = graph.getElements();
        var transitions = new Object();
        for (var element in elements){
            if (elements[element] instanceof pn.Transition){
                transitions[element] = elements[element];
            }
        }
        return transitions;
    }


   window.getFireableTransitions = function(){
        var elements = graph.getElements();
        var fireableTransitions = {};
        for (var id in elements){
            if (elements[id] instanceof pn.Transition && isFireable(elements[id])){
                fireableTransitions[elements[id].id] = elements[id];
            }
        }
        fireableTransitions = selectOnlyHighestPriorityTransitions(fireableTransitions);
        return fireableTransitions;
    }

    function isFireable(transition){
        var inbound = graph.getConnectedLinks(transition, {inbound: true});

        var placesBefore = _.map(inbound, function (link) {
            return createLinkPlaceMap(link, 'source');
        });

        var fireable = true;
        _.each(placesBefore, function (el) {
            if (el.place.get('tokens') < linkValue(el.link)) { fireable = false; }
        });
        return fireable;
    }
	
	window.getAllPlaces = function(){
        var elements = graph.getElements();
        var places = new Object();
        for (var element in elements){
            if (elements[element] instanceof pn.Place){
                places[element] = elements[element];
            }
        }
        return places;
    }

    function createLinkPlaceMap(link, type){
        return {link: link, place: graph.getCell(link.get(type).id)};
    }

    function  selectOnlyHighestPriorityTransitions(fireableTransitions){
        var highestPriority = 1;
        var highestPriorityTransitions = new Object();
        for (var id in fireableTransitions){
            var transition = fireableTransitions[id];
            var transitionPriority = transition.attr(".priority-nb/text");
            if (transitionPriority >= highestPriority){
                if (transitionPriority > highestPriority) {
                    highestPriority = transitionPriority;
                    highestPriorityTransitions = new Object();
                }
                addTransition(highestPriorityTransitions, transition);
            }
        }
        return highestPriorityTransitions;
    }

    function addTransition(transitionsMap, transition){
        transitionsMap[transition.id] = transition;
    }

    var fireableTransitions = {};

    function chooseAndFireTransition(fireableTrans){
        markTransitions(fireableTrans, '#ff0000');
        fireableTransitions = fireableTrans;
        wait4choose = true;
    }

    paper.on('cell:pointerdblclick', function(cellView, evt, x, y){
        if (!freezeChoosing) {
            var transitionToFire = fireableTransitions[cellView.model.id];
            if (transitionToFire !== undefined) {
                turnOffChoosing();
                wait4choose = false;
                fireTransition(transitionToFire);
            }
        }
    });

    function resetPointerDblClick(){
        fireableTransitions = {};
    }

    function markTransitions(fireableTransitions, color) {
        for (var id in fireableTransitions) {
            fireableTransitions[id].attr('.root/stroke', color);
            fireableTransitions[id].attr('.priority/stroke', color);
        }
    }

    function fireTransition(transition) {

        var inbound = graph.getConnectedLinks(transition, {inbound: true});
        var outbound = graph.getConnectedLinks(transition, {outbound: true});

        var transitionInput = _.map(inbound, function (link) {
            return createLinkPlaceMap(link, 'source');
        });
        var transitionOutput = _.map(outbound, function (link) {
            return createLinkPlaceMap(link, 'target');
        });

        var tokenSendingTime = 700;
        var iterationBreak = 500;

        _.each(transitionInput, function (el) {
            paper.findViewByModel(el.link).sendToken(V('circle', {r: 5, fill: 'red'}).node, tokenSendingTime, function(){
                var newTokensNb = el.place.get('tokens') - linkValue(el.link);
                el.place.set('tokens', newTokensNb);
                simulationUpdate(el.place, newTokensNb);
            });
        });
        setTimeout(function(){
            _.each(transitionOutput, function (el) {
                paper.findViewByModel(el.link).sendToken(V('circle', {r: 5, fill: 'red'}).node, tokenSendingTime, function () {
                    var newTokensNb = el.place.get('tokens') + linkValue(el.link);
                    el.place.set('tokens', newTokensNb);
                    simulationUpdate(el.place, newTokensNb);
                });
            });
            setTimeout(function() {
                simulate();
            }, tokenSendingTime + iterationBreak);
        }, tokenSendingTime);
    }

    var freezeChoosing = false;

    paper.on('cell:pointerup', function(cellView, evt, x, y) {
        if (cellView.model instanceof pn.Link) {
            var link = cellView.model;
            // Find the first element below that is not a link nor the dragged element itself.
            var elementBelow = graph.get('cells').find(function (cell) {
                if (cell instanceof pn.Link) return false; // Not interested in links.
                if (cell.id === cellView.model.id) return false; // The same element as the dropped one.
                if (cell.getBBox().containsPoint(g.point(x, y))) {
                    return true;
                }
                return false;
            });

            if (elementBelow) {
                if (otherEndIsConnected(link)){
                    freezeChoosing = false;
                    resimulateAfterMagneting();
                } else {
                    freezeChoosing = true;
                }
            }
        }
    });

    function otherEndIsConnected(link){
        return link.get('source').id || link.get('target').id
    }

    function resimulateAfterMagneting(){
        setTimeout(function(){
            updateParameters();
            resimulateIfNecessary();
        }, 100);
    }
});