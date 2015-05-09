/**
 * Created by Mikolaj on 2015-05-03.
 */
window.graph = new joint.dia.Graph;
window.paper = new joint.dia.Paper({
    el: $('#paper-net'),
    width: 800,
    height: 350,
    gridSize: 10,
    perpendicularLinks: true,
    model: graph
});

window.pn = joint.shapes.pn;

window.lasChangedLink;
