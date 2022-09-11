import { makeAutoObservable } from "mobx";

class ToolState {
  tool = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool) {
    this.tool = tool;
  }

  setColor(color) {
    this.tool.color = color;
  }

  setLineWidth(width) {
    this.tool.lineWidth = width;
  }
}

export default new ToolState();
