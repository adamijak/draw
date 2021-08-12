import {Graph} from "./graph.js"

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paper.setup(canvas);

let graph = new Graph();
let drawMode = false;
let graphGroup = new paper.Group();

let center = paper.project.view.center;
center.x = Math.floor(center.x);
center.y = Math.floor(center.y);

const axes = new paper.CompoundPath({
    children: [
        new paper.Path.Line([0, center.y], [paper.project.view.size.width, center.y]),
        new paper.Path.Line([center.x, 0], [center.x, paper.project.view.size.height]),
    ],
    strokeWidth: 2,
    strokeColor: 'black',
});

const drawAxes = new paper.CompoundPath({
    children: [
        new paper.Path.Line([0, 0], [paper.project.view.size.width, 0]),
        new paper.Path.Line([0, 0], [0, paper.project.view.size.height]),
    ],
    strokeWidth: 0.5,
    strokeColor: 'black',
    visible: false,
});

const drawLine = new paper.Path({
    selected: true,
});

paper.project.view.onMouseDown = (event) => {
    paper.project.view.element.style.setProperty('cursor', 'crosshair');
    drawAxes.visible = true;
    drawAxes.children[0].setPosition([center.x, event.point.y]);
    drawAxes.children[1].setPosition([event.point.x, center.y]);
    graph.offset(event.point);
};

paper.project.view.onMouseDrag = (event) => {
    drawLine.add(event.point);
    graph.append(event.point);
};

paper.project.view.onMouseUp = (event) => {
    if (graph.canFit()) {
        graph.fitDraw(paper.project.view.size.width).then((line) => {
            graphGroup.addChild(line)
            graph.clear();
        });
    }
    paper.project.view.element.style.setProperty('cursor', null);
    drawLine.removeSegments();
};
paper.view.onKeyUp = (event) => {
    if (event.key === 'z'){
        undo();
    }
}
// Global functions
window.selectFn = (fn) => graph.selectFn(fn);
window.selectDrawMode = (bool) => drawMode = bool;
window.undo = () => {
    const lastLine = graphGroup.lastChild;
    if (lastLine !== null){
        lastLine.remove();
    }
}




