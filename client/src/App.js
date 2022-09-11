import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";

function App() {
  return (
    // <HashRouter basename="/">
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route
          path="/:id"
          element={
            <div className="app">
              <Toolbar />
              <SettingBar />
              <Canvas />
            </div>
          }
        />
        <Route
          path="*"
          element={<Navigate to={`/f${(+new Date()).toString(16)}`} replace />}
        />
      </Routes>
    </BrowserRouter>
    // </HashRouter>
  );
}

export default App;
