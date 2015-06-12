/**
 * Created by mnowak on 2015-05-06.
 */
$(document).ready(function(){
    $('#save').click(function() {
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON()));
        $('#save').attr('href', "data:"+data);
    });

    $('#clear').click(function(){
        graph.clear();
        clean();
    })

	$('#anal').click(function(){
		buildMatrixRepresentation();
		var tree = buildReachabilityTree();
		var list = createStatesList();
		var placeLimit = placeLimitation(list);
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
    buildMatrixRepresentation();
}

function resetLoadInput(){
    $("#load").replaceWith($("#load").clone());
    addChangeListenerOnLoad();
}