import Brush from "./brush";

class Eraser extends Brush {
  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler("eraser").bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
  }

  static draw(ctx, x, y) {
    const prevColor = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = prevColor;
    ctx.strokeStyle = prevColor;
  }
}

export default Eraser;
