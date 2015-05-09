/**
 * Created by mnowak on 2015-05-06.
 */
$(document).ready(function(){
    $('#save').click(function() {
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph.toJSON()));
        $('#save').attr('href', "data:"+data);
    });

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
    addLinksMarkers();
    clean();
}

function addLinksMarkers(){
    var links = graph.getLinks();
    for (var linkId in links){
        links[linkId].attr('.marker-target', { d: 'M 10 0 L 0 5 L 10 10 z' })
    }
}

function clean(){
    $('#elements-options').empty();
    resetLoadInput();
}

function resetLoadInput(){
    $("#load").replaceWith($("#load").clone());
    addChangeListenerOnLoad();
}