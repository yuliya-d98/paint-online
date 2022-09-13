import toolState from "../store/toolState";
import Tool from "./tool";

class Circle extends Tool {
  constructor(canvas, socket, sessionId) {
    super(canvas, socket, sessionId);
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
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
          type: "circle",
          x: this.startX,
          y: this.startY,
          radius: this.radius,
          fillColor: toolState.tool.ctx.fillStyle,
          strokeColor: toolState.tool.ctx.strokeStyle,
          lineWidth: toolState.tool.ctx.lineWidth,
        },
      })
    );
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let currentX = e.pageX - e.target.offsetLeft;
      let currentY = e.pageY - e.target.offsetTop;
      let width = currentX - this.startX;
      let height = currentY - this.startY;
      this.radius = Math.sqrt(width ** 2 + height ** 2);
      this.draw(this.startX, this.startY, this.radius);
    }
  }

  draw(x, y, r) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx, x, y, radius, fillColor, strokeColor, lineWidth) {
    const prevFillColor = ctx.fillStyle;
    const prevStrokeColor = ctx.strokeStyle;
    const prevWidth = ctx.lineWidth;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = prevWidth;
    ctx.fillStyle = prevFillColor;
    ctx.strokeStyle = prevStrokeColor;
  }
}

export default Circle;
