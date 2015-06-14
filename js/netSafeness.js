window.netSafeness = function(list){
	var safeness = netBoundedness(list) == 1;
	displayNetSafeness($('#param #netSafe'), safeness);
    return safeness;
}

function displayNetSafeness($div, matrix){
	var $h4 = $div.children('h4');
	$h4.empty();
	$h4.append('Net safe: ' + matrix);

}

