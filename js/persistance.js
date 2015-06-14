/**
 * Created by mnowak on 2015-05-06.
 */
$(document).ready(function(){
    $('#save').click(function() {
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON()));
        $('#save').attr('href', "data:"+data);
    });

    $('#clear').click(function(){
        stopSimulation();
        graph.clear();
        $('.param').empty();
		$('.matrix').empty();
        $('#t g').empty();
		$('#t').height(100);
        clean();
    })

	$('#anal').click(function(){
		buildMatrixRepresentation();
		var tree = buildReachabilityTree();
		tryDraw(tree);
		var placeBound = placeBoundedness(tree);
		var netBound = netBoundedness(tree);
		var netSafe = netSafeness(tree);
		var netConserva = netConservation(tree);
		var netNoDeadlock = netDeadlockFree(tree);
    })
	
    addChangeListenerOnLoad();
});

function addChangeListenerOnLoad(){
    $('#load').on('change', function(){
        if(this.files[0]) {
            fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsText(this.files[0]);
        }
    });
}

function receivedText(e) {
    lines = e.target.result;
    var newArr = JSON.parse(lines);
    graph.fromJSON(newArr);
    updateParameters();
    clean();
}

function clean(){
    $('#elements-options').empty();
//	$('#param').empty();
    resetLoadInput();
}

function resetLoadInput(){
    $("#load").replaceWith($("#load").clone());
    addChangeListenerOnLoad();
}