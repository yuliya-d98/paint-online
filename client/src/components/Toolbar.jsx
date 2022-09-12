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
    const curColor = e.target.value;
    toolState.setColor(curColor);
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

  const changeToolTo = (ToolClass) => {
    toolState.setTool(new ToolClass(canvasState.canvas, socket, sessionId));
  }

  return (
    <div className="toolbar">
      <button className='toolbar__btn brush' onClick={() => changeToolTo(Brush)}></button>
      <button className='toolbar__btn rect' onClick={() => changeToolTo(Rect)}></button>
      <button className='toolbar__btn circle' onClick={() => changeToolTo(Circle)}></button>
      <button className='toolbar__btn eraser' onClick={() => changeToolTo(Eraser)}></button>
      <button className='toolbar__btn line' onClick={() => changeToolTo(Line)}></button>
      <input type='color' onChange={changeColor} style={{ margin: '0 5px' }} />
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()}></button>
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()}></button>
      <button className='toolbar__btn save' onClick={download}></button>
    </div>
  )
})

export default Toolbar;