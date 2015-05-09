/**
 * Created by Mikolaj on 2015-05-03.
 */
window.pn = joint.shapes.pn;

window.graph = new joint.dia.Graph;
window.paper = new joint.dia.Paper({
    el: $('#paper-net'),
    width: 1000,
    height: 500,
    gridSize: 10,
    perpendicularLinks: true,
    model: graph,
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (cellViewS === undefined || cellViewT === undefined) {
            if (cellViewS === undefined) {
                return !isLink(cellViewT);
            } else {
                return !isLink(cellViewS);
            }
        }
        if (cellViewS === cellViewT) { return false; }
        if (isLink(cellViewS) || isLink(cellViewT)) { return false;}
        if (areElementsSameType(cellViewS.model, cellViewT.model)) {
            return false;
        }
        return true;
    }
});

function areElementsSameType(source, target){
        return ((source instanceof pn.Place && target instanceof pn.Place) ||
        (source instanceof pn.Transition && target instanceof pn.Transition));
};

function isLink(cellView){
    return cellView.model instanceof pn.Link;
}

window.linkValue = function(link){
    var value = link.label(0).attrs.text.text;
    if (value === ''){
        value = 1;
    }
    return parseInt(value);
}

window.sleepFor = function(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}