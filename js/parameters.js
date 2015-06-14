/**
 * Created by Michał on 2015-06-12.
 */
 
 
window.placeBoundedness = function(list){
	var limit = [];
	var places = getAllPlaces();
	var i = 0;
	for(var place in places){
		limit[i++] = [places[place].attr(".label/text"), 0];
	}
	for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[0].length; j++) {
			if(list[i][j] == 'w')
				limit[j][1] = list[i][j];
			else if (list[i][j] > limit[j][1]) {
                limit[j][1] = list[i][j];
            }
        }
    }
	displayPlaceBoundedness($('#param #limitPlace'), limit);
	return limit;
}


function displayPlaceBoundedness($div, matrix){
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

window.netBoundedness = function(list){
    var limit = 0;
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[0].length; j++) {
            if (list[i][j] > limit) {
                limit = list[i][j];
            }
        }
    }
    return limit;
}

window.netSafeness = function(list){
    return netBoundedness(list) == 1;
}

window.netConservation = function(list){
    var tokenSumS0 = 0;
    var tokenSum = 0;
    for(var i = 0; i < list[0].length; i++) {
        tokenSumS0 += list[0][i];
    }
    for (var i = 0; i < list.length; i++) {
        tokenSum = 0;
        for(var j = 0; j < list[0].length; j++) {
			if(list[i][j] == 'w')
			return false;
            tokenSum += list[i][j];
        }
        if (tokenSum != tokenSumS0) {
            return false;
		}
    }
    return true;
}

window.netDeadlockFree = function(list) {
    for(var i = 0; i < list.length; i++) {
        if (list[i].status == 'end') {
            return false;
        }
    }
    return true;
}