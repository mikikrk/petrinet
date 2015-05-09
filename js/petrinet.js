/**
 * Created by Mikolaj on 2015-05-02.
 */
$(document).ready(function(){

    $('#simulate').click(function(){
        simulate();
    });

    var pReady = new pn.Place({position: {x: 140, y: 50}, attrs: {'.label': {text: 'ready'}}, tokens: 0});
    var pIdle = new pn.Place({position: {x: 140, y: 260}, attrs: {'.label': {text: 'idle'}}, tokens: 0});
    var buffer = new pn.Place({position: {x: 350, y: 160}, attrs: {'.label': {text: 'buffer'}}, tokens: 1});
    var cAccepted = new pn.Place({position: {x: 550, y: 50}, attrs: {'.label': {text: 'accepted'}}, tokens: 0});
    var cReady = new pn.Place({position: {x: 560, y: 260}, attrs: {'.label': {text: 'ready'}}, tokens: 1});

    var pProduce = new pn.Transition({position: {x: 50, y: 160}, attrs: {'.label': {text: 'produce'}, '.priority-nb': {text: 1}}});
    var pSend = new pn.Transition({position: {x: 270, y: 160}, attrs: {'.label': {text: 'send'}, '.priority-nb': {text: 1}}});
    var cAccept = new pn.Transition({position: {x: 470, y: 160}, attrs: {'.label': {text: 'accept'}, '.priority-nb': {text: 1}}});
    var cConsume = new pn.Transition({position: {x: 680, y: 160}, attrs: {'.label': {text: 'consume'}, '.priority-nb': {text: 1}}});

    function link(a, b) {

        return new pn.Link({
            source: {id: a.id, selector: '.root'},
            target: {id: b.id, selector: '.root'},
            labels: [{ position: .5, attrs: { text: { text: '' } } }]
        });
    }

    graph.addCell([pReady, pIdle, buffer, cAccepted, cReady, pProduce, pSend, cAccept, cConsume]);

    graph.addCell([
        link(pProduce, pReady),
        link(pReady, pSend),
        link(pSend, pIdle),
        link(pIdle, pProduce),
        link(pSend, buffer),
        link(buffer, cAccept),
        link(cAccept, cAccepted),
        link(cAccepted, cConsume),
        link(cConsume, cReady),
        link(cReady, cAccept)
    ]);

    function isFireable(transition){
        var inbound = graph.getConnectedLinks(transition, {inbound: true});

        var placesBefore = _.map(inbound, function (link) {
            return createLinkPlaceMap(link, 'source');
        });

        var fireable = true;
        _.each(placesBefore, function (el) {
            if (el.place.get('tokens') < linkValue(el.link)) { fireable = false; }
        });
        return fireable;
    }

    function createLinkPlaceMap(link, type){
        return {link: link, place: graph.getCell(link.get(type).id)};
    }

    function fireTransition(transition) {

        var inbound = graph.getConnectedLinks(transition, {inbound: true});
        var outbound = graph.getConnectedLinks(transition, {outbound: true});

        var transactionInput = _.map(inbound, function (link) {
            return createLinkPlaceMap(link, 'source');
        });
        var transactionOutput = _.map(outbound, function (link) {
            return createLinkPlaceMap(link, 'target');
        });

        var tokenSendingTime = 700;

        _.each(transactionInput, function (el) {
            paper.findViewByModel(el.link).sendToken(V('circle', {r: 5, fill: 'red'}).node, tokenSendingTime, function(){
                el.place.set('tokens', el.place.get('tokens') - linkValue(el.link));
            });
        });
        setTimeout(function(){
        _.each(transactionOutput, function (el) {
            paper.findViewByModel(el.link).sendToken(V('circle', {r: 5, fill: 'red'}).node, tokenSendingTime, function () {
                el.place.set('tokens', el.place.get('tokens') + linkValue(el.link));
            });
        })}, tokenSendingTime);
    }

    function simulate() {
        var transitions = [pProduce, pSend, cAccept, cConsume];
        _.each(transitions, function (t) {
            if (isFireable(t)){
                fireTransition(t);
            }
        });
    }

    function stopSimulation(simulationId) {
        clearInterval(simulationId);
    }

});