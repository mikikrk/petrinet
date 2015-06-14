/**
 * Created by Michał on 2015-06-14.
 */
 
window.netBoundedness = function(list){
    var limit = 0;
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[0].length; j++) {
			if(list[i][j] == 'w'){
				limit = 'w';
				break;
			}
            if (list[i][j] > limit) {
                limit = list[i][j];
            }
        }
    }
	displayNetBoundedness($('#param #limitNet'), limit)
    return limit;
}

function displayNetBoundedness($div, matrix){
	var $h4 = $div.children('h4');
	$h4.empty();
	$h4.append('Net bound: ' + matrix);

}