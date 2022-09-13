import toolState from "../store/toolState";
import Tool from "./tool";

class Line extends Tool {
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
    this.currentX = e.pageX - e.target.offsetLeft;
    this.currentY = e.pageY - e.target.offsetTop;
    this.ctx.beginPath();
    this.ctx.moveTo(this.currentX, this.currentY);
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.sessionId,
        figure: {
          type: "line",
          x1: this.currentX,
          y1: this.currentY,
          x2: e.pageX - e.target.offsetLeft,
          y2: e.pageY - e.target.offsetTop,
          fillColor: toolState.tool.ctx.fillStyle,
          strokeColor: toolState.tool.ctx.strokeStyle,
          lineWidth: toolState.tool.ctx.lineWidth,
        },
      })
    );
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }

  static draw(ctx, x1, y1, x2, y2, fillColor, strokeColor, lineWidth) {
    const prevFillColor = ctx.fillStyle;
    const prevStrokeColor = ctx.strokeStyle;
    const prevWidth = ctx.lineWidth;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.lineWidth = prevWidth;
    ctx.fillStyle = prevFillColor;
    ctx.strokeStyle = prevStrokeColor;
  }
}

export default Line;
