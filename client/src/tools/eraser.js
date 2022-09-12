import toolState from "../store/toolState";
import Brush from "./brush";

class Eraser extends Brush {
  mouseDownHandler(e) {
    this.prevColor = toolState.tool.ctx.strokeStyle;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    super.mouseDownHandler(e);
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(
        JSON.stringify({
          method: "draw",
          id: this.sessionId,
          figure: {
            type: "eraser",
            x: e.pageX - e.target.offsetLeft,
            y: e.pageY - e.target.offsetTop,
            lineWidth: toolState.tool.ctx.lineWidth,
          },
        })
      );
    }
  }

  mouseUpHandler(e) {
    super.mouseUpHandler(e);
    this.ctx.fillStyle = this.prevColor;
    this.ctx.strokeStyle = this.prevColor;
  }

  static draw(ctx, x, y, lineWidth) {
    const prevColor = ctx.fillStyle;
    const prevLineWidth = ctx.lineWidth;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = prevColor;
    ctx.strokeStyle = prevColor;
    ctx.lineWidth = prevLineWidth;
  }
}

export default Eraser;
