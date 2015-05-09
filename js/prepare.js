/**
 * Created by Mikolaj on 2015-05-03.
 */

paper.on('cell:highlight', function(cellView, evt, x, y) {
    if (cellView.model instanceof pn.Link){
        console.log("pointerup!!!!!!!!!!")
        restrictLinkConnections(cellView.model);
    }
});

function restrictLinkConnections(link){
    switch (lastChangedLink){
        case 'source':
            restrictConnectingTheSameSourceType(link);
            break;
        case 'target':
            restrictConnectingTheSameTargetType(link);
            break;
    }
}

function restrictConnectingTheSameSourceType(link){
    var target = link.get('target');
    if (areElementsSame(link.get('source'), target)){
        link.set('source', getUnconnectedXY(target.id));
    }
}

function restrictConnectingTheSameTargetType(link){
    var source = link.get('source');
    if (areElementsSame(source, link.get('target'))){
        link.set('target', getUnconnectedXY(source.id));
    }
}

function areElementsSame(source, target){
    if (source.id !== undefined && target.id !== undefined){
        var sourceElement = graph.getCell(source.id);
        var targetElement = graph.getCell(target.id);
        return ((sourceElement instanceof pn.Place && targetElement instanceof pn.Place) ||
        (sourceElement instanceof pn.Transition && targetElement instanceof pn.Transition));
    }else {
        return false;
    }
};

function getUnconnectedXY(elementId){
    var element = graph.getCell(elementId);
    return {x: 20, y: 20};
};