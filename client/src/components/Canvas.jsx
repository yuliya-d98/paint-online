import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/brush';
import Circle from '../tools/circle';
import Eraser from '../tools/eraser';
import Line from '../tools/line';
import Rect from '../tools/rect';
import { instance } from '../utils/instance';
import UsernameModal from './UsernameModal';

const socketURL = process.env.REACT_APP_SOCKET_URL;

const Canvas = observer(() => {
  const canvasRef = useRef();
  const params = useParams();

  const mouseDownHandler = () => {
    const dataUrl = canvasRef.current.toDataURL();
    canvasState.pushToUndo(dataUrl);
    instance
      .post(`/image?id=${params.id}`, { img: dataUrl })
      .then((res) => console.log(res.data));
  }

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext('2d')
    instance
      .get(`/image?id=${params.id}`)
      .then((res) => {
        const img = new Image();
        img.src = res.data;
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
      });
  }, [])

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y, figure.fillColor, figure.strokeColor, figure.lineWidth);
        break;
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeColor, figure.lineWidth);
        break;
      case 'circle':
        Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.fillColor, figure.strokeColor, figure.lineWidth);
        break;
      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
        break;
      case 'line':
        Line.draw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.fillColor, figure.strokeColor, figure.lineWidth);
        break;
      case 'finish':
        ctx.beginPath();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(socketURL);
      const sessionId = params.id;
      canvasState.setSocket(socket);
      canvasState.setSessionId(sessionId);
      toolState.setTool(new Brush(canvasRef.current, socket, sessionId));

      socket.onopen = () => {
        try {
          socket.send(JSON.stringify({
            id: sessionId,
            username: canvasState.username,
            method: 'connection',
          }))
          canvasState.setInfo('Connection', 'Connection established');
        } catch (e) {
          canvasState.setInfo('Error', e.message);
        }
      }

      socket.onmessage = (event) => {
        try {
          let msg = JSON.parse(event.data);
          switch (msg.method) {
            case 'connection':
              canvasState.setInfo('New user', `User ${msg.username} joined`)
              break;
            case 'draw':
              drawHandler(msg);
              break;
            default:
              break;
          }
        } catch (e) {
          canvasState.setInfo('Error', e.message);
        }
      }

      socket.onerror = (error) => {
        canvasState.setInfo('Error', error.message);
      }
    }
  }, [canvasState.username])

  return (
    <div className="canvas">
      <UsernameModal />
      <canvas width={600} height={400} ref={canvasRef} onMouseDown={mouseDownHandler}>
        Sorry, your browser doesn't support canvas.
      </canvas>
    </div>
  )
})

export default Canvas;