import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/brush';
import { useParams } from 'react-router-dom';
import Eraser from '../tools/eraser';
import Rect from '../tools/rect';
import axios from 'axios';

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const params = useParams();

  const mouseDownHandler = () => {
    const dataUrl = canvasRef.current.toDataURL();
    canvasState.pushToUndo(dataUrl);
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, { img: dataUrl })
      .then((res) => console.log(res.data));
  }

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext('2d')
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((res) => {
        const img = new Image();
        img.src = res.data;
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
      });
  }, [])

  const connectHandler = () => {
    const username = usernameRef.current.value;
    canvasState.setUsername(username);
    setIsModalOpen(false);
  }

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
        break;
      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y);
        break;
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth);
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
      const socket = new WebSocket('ws://localhost:5000/');
      const sessionId = params.id;
      canvasState.setSocket(socket);
      canvasState.setSessionId(sessionId);
      toolState.setTool(new Brush(canvasRef.current, socket, sessionId));

      socket.onopen = () => {
        console.log('сщединение установлено!!!!!!!');
        socket.send(JSON.stringify({
          id: sessionId,
          username: canvasState.username,
          method: 'connection',
        }))
      }

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} присоединился.`);
            break;
          case 'draw':
            drawHandler(msg);
            break;
          default:
            break;
        }
      }
    }
  }, [canvasState.username])

  return (
    <div className="canvas">
      <Modal show={isModalOpen} onHide={connectHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Write your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input ref={usernameRef} autoFocus />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={connectHandler}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas width={600} height={400} ref={canvasRef} onMouseDown={mouseDownHandler}>
        Sorry, your browser doesn't support canvas.
      </canvas>
    </div>
  )
})

export default Canvas;