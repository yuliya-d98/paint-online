import toolState from "../store/toolState";

const SettingBar = () => {
  const styles = { margin: '0 10px' };

  const changeLineWidth = (e) => {
    const curLinewidth = e.target.value;
    toolState.setLineWidth(curLinewidth);
  }

  const changeFillColor = (e) => {
    const curFillColor = e.target.value;
    toolState.setFillColor(curFillColor);
  }

  const changeStrokeColor = (e) => {
    const curStrokeColor = e.target.value;
    toolState.setStrokeColor(curStrokeColor);
  }

  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={changeLineWidth}
        id='line-width'
        type='number'
        min='1'
        max='50'
        defaultValue='1'
        style={styles}
      />
      <label htmlFor="fill-style">Fill color</label>
      <input
        onChange={changeFillColor}
        id='fill-style'
        type='color'
        style={styles}
      />
      <label htmlFor="stroke-style">Stroke color</label>
      <input
        onChange={changeStrokeColor}
        id='stroke-style'
        type='color'
        style={styles}
      />
    </div>
  )
}

export default SettingBar;