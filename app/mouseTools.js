export class MouseTools {
    tools = {};
    constructor(def, tools) {
        this.tools = tools;
        this.selectTool(def);
    }

    selectTool(tool) {
        const selectedTool = this.tools[tool];
        paper.project.view.onMouseDown = selectedTool.onMouseDown;
        paper.project.view.onMouseDrag = selectedTool.onMouseDrag;
        paper.project.view.onMouseUp = selectedTool.onMouseUp;
    }
}