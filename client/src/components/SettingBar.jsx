import toolState from "../store/toolState";

const SettingBar = () => {
  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={(e) => toolState.setLineWidth(e.target.value)}
        id='line-width'
        type='number'
        min='1'
        max='50'
        defaultValue='1'
        style={{ margin: '0 10px' }}
      />
    </div>
  )
}

export default SettingBar;