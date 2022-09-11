import toolState from "../store/toolState";
import Tool from "./tool";

class Brush extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler("brush").bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
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

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.pageX - e.target.offsetLeft,
      e.pageY - e.target.offsetTop
    );
  }

  mouseMoveHandler(figureType) {
    return function (e) {
      if (this.mouseDown) {
        // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
        this.socket.send(
          JSON.stringify({
            method: "draw",
            id: this.sessionId,
            figure: {
              type: figureType,
              x: e.pageX - e.target.offsetLeft,
              y: e.pageY - e.target.offsetTop,
              color: toolState.tool.color,
              lineWidth: toolState.tool.ctx.lineWidth,
            },
          })
        );
      }
    };
  }

  static draw(ctx, x, y, color, lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

export default Brush;
