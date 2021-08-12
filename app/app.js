import {Graph} from "./graph.js"
import {Axes} from "./axes.js";
import {MouseTools} from "./mouseTools.js";

const canvas = document.getElementById('canvas');
const colorSelector = document.getElementById('colorSelector');
const functionSelector = document.getElementById('functionSelector');
const offsetDrawMode = document.getElementById("offsetDrawMode");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paper.setup(canvas);

const axes = new Axes(paper.project.view.center);
let graph = new Graph();
let graphStack = new paper.Group();
let redoStack = new paper.Group({
    visible: false
});

const drawLine = new paper.Path({
    selected: true,
});

let selectedCenter = false;
const mouseTools = new MouseTools(offsetDrawMode.checked ? 'offsetDraw' : 'centeredDraw', {
    'centeredDraw': {
        onMouseDown: (event) => {
            paper.project.view.element.style.setProperty('cursor', 'crosshair');
            graph.offset(event.point);
            graph.selectFn(functionSelector.value);
            axes.secAxesMove(event.point);
        },
        onMouseDrag: (event) => {
            drawLine.add(event.point);
            graph.append(event.point);
        },
        onMouseUp: (event) => {
            fit();
            paper.project.view.element.style.setProperty('cursor', null);
            drawLine.removeSegments();
        },
    },

    'offsetDraw': {
        onMouseDown: (event) => {
            if(selectedCenter){
                drawLine.add(event.point);
                graph.append(event.point);
            }
        },
        onMouseDrag: (event) => {
            if(selectedCenter){
                drawLine.add(event.point);
                graph.append(event.point);
            }
        },
        onMouseUp: (event) => {
            if(!selectedCenter){
                selectedCenter = true;
                paper.project.view.element.style.setProperty('cursor', 'crosshair');
                graph.offset(event.point);
                graph.selectFn(functionSelector.value);
                axes.secAxesMove(event.point);
            }else{
                selectedCenter = false;
                fit();
                paper.project.view.element.style.setProperty('cursor', null);
                drawLine.removeSegments();
            }
        },
    },
});

const fit = () => {
    if (graph.canFit()) {
        graph.fitDraw(paper.project.view.size.width, colorSelector.value).then((line) => {
            redoStack.removeChildren();
            graphStack.addChild(line)
            graph.clear();
        });
    }
};

paper.view.onKeyUp = (event) => {
    switch (event.key){
        case 'z':
            if (event.modifiers.shift) {
                redo();
            } else {
                undo();
            }
            break;

        case 'escape':
            selectedCenter = false;
            paper.project.view.element.style.setProperty('cursor', null);
            break;
    }
}

// Global functions
offsetDrawMode.onclick = () => mouseTools.selectTool(offsetDrawMode.checked ? 'offsetDraw' : 'centeredDraw');
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




