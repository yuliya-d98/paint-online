import { makeAutoObservable, toJS } from "mobx";

class CanvasState {
  canvas = null;
  socket = null;
  sessionId = null;
  undoList = [];
  redoList = [];
  username = "";
  info = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    let ctx = this.canvas.getContext("2d");
    if (this.undoList.length) {
      let dataURL = this.undoList.pop();
      this.redoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  redo() {
    let ctx = this.canvas.getContext("2d");
    if (this.redoList.length) {
      let dataURL = this.redoList.pop();
      this.undoList.push(this.canvas.toDataURL());
      let img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }

  setUsername(username) {
    this.username = username;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  setInfo(title, body) {
    const info = {
      title,
      body,
    };
    this.info = [...toJS(this.info), info];
  }

  removeInfo(body) {
    this.info = [...toJS(this.info)].filter((info) => info.body !== body);
  }
}

export default new CanvasState();
