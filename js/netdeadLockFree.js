window.netDeadlockFree = function(list) {
    for(var i = 0; i < list.length; i++) {
        if (list[i].status == 'end') {
			displayNetDeadLockFree($('#param #netDLFree'), 'false')
            return false;
        }
    }
	displayNetDeadLockFree($('#param #netDLFree'), 'true')
    return true;
}

function displayNetDeadLockFree($div, matrix){
	var $h4 = $div.children('h4');
	$h4.empty();
	$h4.append('Net dead lock free: ' + matrix);
}