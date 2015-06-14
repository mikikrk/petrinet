window.netConservation = function(list){
    var state0 = 0;
    var states = 0;
    for(var i = 0; i < list[0].length; i++) {
        state0 += list[0][i];
    }
    for (var i = 0; i < list.length; i++) {
        states = 0;
        for(var j = 0; j < list[0].length; j++) {
			if(list[i][j] == 'w'){
				displayNetConservation($('#param #netC'), 'false')
				return false;
			}
            states += list[i][j];
        }
        if (states != state0) {
			displayNetConservation($('#param #netC'), 'false')
            return false;
		}
    }
	displayNetConservation($('#param #netC'), 'true')
    return true;
}

function displayNetConservation($div, matrix){
	var $h4 = $div.children('h4');
	$h4.empty();
	$h4.append('Net conservative: ' + matrix);
}