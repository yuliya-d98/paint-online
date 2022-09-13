import '../styles/toolbar.scss';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/brush';
import Circle from '../tools/circle';
import Eraser from '../tools/eraser';
import Line from '../tools/line';
import Rect from '../tools/rect';
import TooltipItem from './Tooltip';

const Toolbar = observer(() => {
  const params = useParams();
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);

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

  const tools = [
    { tooltip: 'Brush', classname: 'brush', onClick: () => changeToolTo(Brush) },
    { tooltip: 'Rectangle', classname: 'rectangle', onClick: () => changeToolTo(Rect) },
    { tooltip: 'Circle', classname: 'circle', onClick: () => changeToolTo(Circle) },
    { tooltip: 'Eraser', classname: 'eraser', onClick: () => changeToolTo(Eraser) },
    { tooltip: 'Line', classname: 'line', onClick: () => changeToolTo(Line) },
    { tooltip: 'Undo', classname: 'undo', onClick: () => canvasState.undo() },
    { tooltip: 'Redo', classname: 'redo', onClick: () => canvasState.redo() },
    { tooltip: 'Save', classname: 'save', onClick: download },
  ]

  return (
    <div className="toolbar">
      {tools.map((tool) => <ToolbarItem tooltip={tool.tooltip} classname={tool.classname} onClick={tool.onClick} key={tool.tooltip} />)}
    </div>
  )
})

export default Toolbar;

const ToolbarItem = ({ tooltip, classname, onClick }) => {
  return (
    <TooltipItem text={tooltip}>
      <button className={`toolbar__btn ${classname}`} onClick={onClick}></button>
    </TooltipItem>
  )
}