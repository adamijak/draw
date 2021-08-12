export class MouseTools {
    tools = {};
    constructor(def, tools) {
        this.tools = tools;
        this.selectTool(def);
    }

    selectTool(tool) {
        const selectedTool = this.tools[tool];
        selectedTool(paper.project.view);
    }
}