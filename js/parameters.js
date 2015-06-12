/**
 * Created by Michał on 2015-06-12.
 */
 
 
window.placeLimitation = function(list){
	var limit = [];
	var places = getAllPlaces();
	var i = 0;
	for(var place in places){
		limit[i++] = [places[place].attr(".label/text"), 0];
	}
	for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[0].length; j++) {
            if (list[i][j] > limit[j][1]) {
                limit[j][1] = list[i][j];
            }
        }
    }
	displayPlaceLimitation($('#param #limitPlace'), limit);
	return limit;
}


function displayPlaceLimitation($div, matrix){
	var $table = $div.children('table');
	$table.empty();
	var $tr = $("<tr><td>Place name</td><td>Limit</td>");
	$table.append($tr);
	for (var i = 0; i < matrix.length; i++){
		$tr = $("<tr>");
		for (var j = 0; j < matrix[i].length; j++){
			var $td = $("<td>");
			$td.append(matrix[i][j]);
			$tr.append($td);
		}
		$table.append($tr);
	}
}