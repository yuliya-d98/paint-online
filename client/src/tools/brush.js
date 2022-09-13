import toolState from "../store/toolState";
import Tool from "./tool";

class Brush extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.pageX - e.target.offsetLeft,
      e.pageY - e.target.offsetTop
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(
        JSON.stringify({
          method: "draw",
          id: this.sessionId,
          figure: {
            type: "brush",
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
            fillColor: toolState.tool.ctx.fillStyle,
            strokeColor: toolState.tool.ctx.strokeStyle,
            lineWidth: toolState.tool.ctx.lineWidth,
          },
        })
      );
    }
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.sessionId,
        figure: {
          type: "finish",
        },
      })
    );
  }

  static draw(ctx, x, y, fillColor, strokeColor, lineWidth) {
    const prevFillColor = ctx.fillStyle;
    const prevStrokeColor = ctx.strokeStyle;
    const prevWidth = ctx.lineWidth;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.lineWidth = prevWidth;
    ctx.fillStyle = prevFillColor;
    ctx.strokeStyle = prevStrokeColor;
  }
}

export default Brush;
