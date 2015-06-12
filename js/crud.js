/**
 * Created by Mikolaj on 2015-05-03.
 */
$(document).ready(function(){

    var placesCounter = 1;
    var transitionsCounter = 1;

    window.resetCRUDCounters = new function(){
        placesCounter = 1;
        transitionsCounter = 1;
    }

    $('#add-place').click(function(){
        var place = new pn.Place({position: {x: 10, y: 30}, attrs: {'.label': {text: 'Place ' + placesCounter++}}, tokens: 0});
        graph.addCell([place]);
        displayOptions(place);
    });

    $('#add-transition').click(function(){
        var transition = new pn.Transition({position: {x: 30, y: 30}, attrs: {'.label': {text: 'Transition ' + transitionsCounter++}, '.priority-nb': {text: 1}}});
        graph.addCell([transition]);
        displayOptions(transition);
    });

    $('#add-link').click(function(){
        var link = new pn.Link({source: { x: 10, y: 20 }, target: { x: 100, y: 20 }, labels: [{ position: .5, attrs: { text: { text: '' } } }]});
        graph.addCell([link]);
        displayOptions(link);
    });

});

window.updateParameters = function(){
   
}
