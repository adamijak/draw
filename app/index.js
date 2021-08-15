import {Graph} from "./graph.js"
import {Axes} from "./axes.js";
import {MouseTools} from "./mouseTools.js";

const canvas = document.getElementById('canvas');
const functionSelector = document.getElementById('functionSelector');
const offsetDrawMode = document.getElementById("offsetDrawMode");



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

paper.setup(canvas);
const axes = new Axes();
let graph = new Graph(functionSelector.value);
let graphStack = new paper.Group();
let redoStack = new paper.Group({
    visible: false
});

const drawLine = new paper.Path({
    selected: true,
});

const tryFit = () => {
    try {
        if (graph.canFit()) {
            const line = graph.fitDraw(paper.project.view.size.width);
            redoStack.removeChildren();
            graphStack.addChild(line)
            graph.clear();
        }
    } catch (e) {
        console.error(e);
    }
};

const handleCommonKeys = (event) => {
    switch (event.key) {
        case 'z':
            if (event.modifiers.shift) {
                redo();
            } else {
                undo();
            }
            break;
    }
}

const mouseTools = new MouseTools(offsetDrawMode.checked ? 'offsetDraw' : 'centeredDraw', {
    'centeredDraw': (obj) => {
        obj.onMouseDown = (event) => {
            paper.project.view.element.style.setProperty('cursor', 'crosshair');
            graph.offset(event.point);
            axes.secAxesMove(event.point);
        };

        obj.onMouseDrag = (event) => {
            drawLine.add(event.point);
            graph.append(event.point);
        };

        obj.onMouseUp = (event) => {
            tryFit();
            paper.project.view.element.style.setProperty('cursor', null);
            drawLine.removeSegments();
        };

        obj.onKeyUp = handleCommonKeys;
    },
    'offsetDraw': (obj) => {
        let clickCounter = 0;
        const endOffsetDraw = () => {
            clickCounter = 0;
            functionSelector.disabled = false;
            paper.project.view.element.style.setProperty('cursor', null);
            drawLine.removeSegments();
        };

        obj.onMouseDown = (event) => {
            if (clickCounter === 0) {
                paper.project.view.element.style.setProperty('cursor', 'crosshair');
                graph.offset(event.point);
                functionSelector.disabled = true;
                axes.secAxesMove(event.point);
            } else {
                drawLine.add(event.point);
                graph.append(event.point);
            }
            clickCounter++;
        };

        obj.onMouseDrag = (event) => {
            if (clickCounter === 3) {
                drawLine.add(event.point);
                graph.append(event.point);
            }
        };

        obj.onMouseUp = (event) => {
            if (clickCounter === 3) {
                tryFit();
                endOffsetDraw();
            } else if (clickCounter !== 0) {
                clickCounter++;
            }
        };

        obj.onKeyUp = (event) => {
            switch (event.key) {
                case 'escape':
                    endOffsetDraw()
                    break;
                default:
                    handleCommonKeys(event);
            }
        }
    },
});

paper.project.view.onResize = () => {
    axes.axesMoveToCenter();
};

// Global functions
offsetDrawMode.onclick = () => mouseTools.selectTool(offsetDrawMode.checked ? 'offsetDraw' : 'centeredDraw');
functionSelector.onchange = () => {
    const defaultTool = graph.selectFn(functionSelector.value);
    mouseTools.selectTool(defaultTool);
    offsetDrawMode.checked = defaultTool === 'offsetDraw';
}

const undo = () => {
    const lastLine = graphStack.lastChild;
    if (lastLine !== null) {
        lastLine.remove();
        redoStack.addChild(lastLine);
    }
}

const redo = () => {
    const lastLine = redoStack.lastChild;
    if (lastLine !== null) {
        lastLine.remove();
        graphStack.addChild(lastLine);
    }
}


document.getElementById('undo').onclick = undo;
document.getElementById('redo').onclick = redo;







