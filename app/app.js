import {Graph} from "./graph.js"

let graph = new Graph();
let centeredDraw = false;
let centeredDrawSelected = false;
let isDrawing = false;
let lastLine;

const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

stage.on("mousedown", () => {
    isDrawing = true;
    const mouse = stage.getPointerPosition();
    graph.offset(mouse.x, mouse.y);

    lastLine = new Konva.Line({
        stroke: 'green',
        strokeWidth: 5,
        points: [mouse.x, mouse.y],
    });
    layer.add(lastLine);
});

stage.on("mousemove", () => {
    if (!isDrawing) {
        return;
    }

    const mouse = stage.getPointerPosition();
    graph.append(mouse.x, mouse.y);
    lastLine.points(lastLine.points().concat([mouse.x, mouse.y]));
});

stage.on("mouseup", () => {
    isDrawing = false;
    if (graph.canFit()) {
        graph.fitDraw(stage.width()).then((res) =>{
            layer.add(res);
            graph.clear();
            lastLine.remove();
        });
    }
});

window.graph = graph;
window.stage = stage;
window.selectFn = (fn) => graph.selectFn(fn);
window.setCenteredDraw = (bool) => centeredDraw = bool;

