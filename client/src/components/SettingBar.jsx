import { useState, useEffect } from "react";
import toolState from "../store/toolState";
import { observer } from 'mobx-react-lite';

const SettingBar = observer(() => {
  const [lineWidth, setLineWidth] = useState('1');
  const [fillColor, setFillColor] = useState('#80FF00');
  const [strokeColor, setStrokeColor] = useState('#FF0095');

  const styles = { margin: '0 10px' };

  const changeLineWidth = (e) => {
    const curLinewidth = e.target.value;
    setLineWidth(curLinewidth);
    toolState.setLineWidth(curLinewidth);
  }

  const changeFillColor = (e) => {
    const curFillColor = e.target.value;
    setFillColor(curFillColor);
    toolState.setFillColor(curFillColor);
  }

  const changeStrokeColor = (e) => {
    const curStrokeColor = e.target.value;
    setStrokeColor(curStrokeColor);
    toolState.setStrokeColor(curStrokeColor);
  }

  useEffect(() => {
    if (toolState.tool) {
      toolState.setLineWidth(lineWidth);
      toolState.setFillColor(fillColor);
      toolState.setStrokeColor(strokeColor);
    }
  }, [toolState.tool])

  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={changeLineWidth}
        id='line-width'
        type='number'
        min='1'
        max='50'
        value={lineWidth}
        style={styles}
      />
      <label htmlFor="fill-style">Fill color</label>
      <input
        onChange={changeFillColor}
        id='fill-style'
        type='color'
        style={styles}
        value={fillColor}
      />
      <label htmlFor="stroke-style">Stroke color</label>
      <input
        onChange={changeStrokeColor}
        id='stroke-style'
        type='color'
        value={strokeColor}
        style={styles}
      />
    </div>
  )
})

export default SettingBar;