import {Graph} from "./graph.js"
import {Axes} from "./axes.js";

const canvas = document.getElementById('canvas');
const colorSelector = document.getElementById('colorSelector');
const functionSelector = document.getElementById('functionSelector');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paper.setup(canvas);

const axes = new Axes(paper.project.view.center);
let graph = new Graph();
let drawMode = false;
let offsetSelected = false;
let graphStack = new paper.Group();
let redoStack = new paper.Group({
    visible: false
});

const drawLine = new paper.Path({
    selected: true,
});

paper.project.view.onMouseDown = (event) => {
    paper.project.view.element.style.setProperty('cursor', 'crosshair');
    graph.offset(event.point);
    graph.selectFn(functionSelector.value);
    offsetSelected = true;
    axes.secAxesMove(event.point);
};

paper.project.view.onMouseDrag = (event) => {
    drawLine.add(event.point);
    graph.append(event.point);
};

paper.project.view.onMouseUp = (event) => {
    if (graph.canFit()) {
        graph.fitDraw(paper.project.view.size.width, colorSelector.value).then((line) => {
            redoStack.removeChildren();
            graphStack.addChild(line)
            graph.clear();
        });
    }
    paper.project.view.element.style.setProperty('cursor', null);
    drawLine.removeSegments();
};

paper.view.onKeyUp = (event) => {
    if (event.key === 'z') {
        if (event.modifiers.shift) {
            redo();
        } else {
            undo();
        }
    }
}

// Global functions
window.selectDrawMode = (bool) => drawMode = bool;
window.undo = () => {
    const lastLine = graphStack.lastChild;
    if (lastLine !== null) {
        lastLine.remove();
        redoStack.addChild(lastLine);
    }
}
window.redo = () => {
    const lastLine = redoStack.lastChild;
    if (lastLine !== null) {
        lastLine.remove();
        graphStack.addChild(lastLine);
    }
}




