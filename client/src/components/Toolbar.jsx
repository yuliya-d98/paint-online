import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/toolbar.scss';
import Brush from '../tools/brush';
import Circle from '../tools/circle';
import Eraser from '../tools/eraser';
import Line from '../tools/line';
import Rect from '../tools/rect';

const Toolbar = observer(() => {
  const params = useParams();
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const changeColor = (e) => {
    const color = e.target.value;
    toolState.setColor(color);
  }

  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasState.sessionId + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }

  useEffect(() => {
    if (canvasState.socket) {
      setSocket(canvasState.socket);
      setSessionId(params.id);
    }
  }, [canvasState.socket])

  return (
    <div className="toolbar">
      <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush(canvasState.canvas, socket, sessionId))}></button>
      <button className='toolbar__btn rect' onClick={() => toolState.setTool(new Rect(canvasState.canvas, socket, sessionId))}></button>
      <button className='toolbar__btn circle' onClick={() => toolState.setTool(new Circle(canvasState.canvas, socket, sessionId))}></button>
      <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas, socket, sessionId))}></button>
      <button className='toolbar__btn line' onClick={() => toolState.setTool(new Line(canvasState.canvas, socket, sessionId))}></button>
      <input type='color' onChange={changeColor} style={{ margin: '0 5px' }} />
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()}></button>
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()}></button>
      <button className='toolbar__btn save' onClick={download}></button>
    </div>
  )
})

export default Toolbar;