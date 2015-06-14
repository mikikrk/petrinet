// Input related code goes here

var oldInputGraphValue;
/*
// Set up zoom support
var svg = d3.select("svg"),
    inner = d3.select("svg g"),
    zoom = d3.behavior.zoom().on("zoom", function() {
      inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                  "scale(" + d3.event.scale + ")");
    });
svg.call(zoom);
*/
// Create and configure the renderer
var render = dagreD3.render();

function tryDraw(tree) {
  var inputGraph = parse(tree);
  var g;
    try {
     g = graphlibDot.read(inputGraph);
    } catch (e) {
      throw e;
    }

    // Set margins, if not present
    if (!g.graph().hasOwnProperty("marginx") &&
        !g.graph().hasOwnProperty("marginy")) {
      g.graph().marginx = 20;
      g.graph().marginy = 20;
    }

    g.graph().transition = function(selection) {
      return selection.transition().duration(500);
    };

    // Render the graph into svg g
    d3.select("svg#t g").call(render, g);
}

function parse(tree){
	var input = 'digraph { node [rx=5 ry=5 labelStyle="font: 300 10px \'Helvetica Neue\', Helvetica"] edge [labelStyle="font: 300 12px \'Helvetica Neue\', Helvetica"]';
	
	for(var i = 0; i < tree.length; i++){
		var node = tree[i].id[0] + ' [label="';
		for(var j = 0; j < tree[i].length; j++){
			if(j < tree[i].length -1)
				node += tree[i][j] + ','
			else
				node += tree[i][j] + '"];'
		}
		input += node;
	}
	for(var i = 0; i < tree.length; i++){
		if(tree[i].parent.length > 0){
			var parents = tree[i].parent.split(";");
			var transitions = tree[i].transition.split(";");
			for(var j = 0; j < parents.length - 1; j++){
				var link = parents[j] + '->' + tree[i].id[0] + ' [label="' + transitions[j] + '"];';
				input += link;
				}
		}
	}
	input += '}'
	return input;
}