import Landing from "./Landing"
import Dashboard from "./Dashboard";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../css/main.css";

function App() {
  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    containerStyle: {
    }
  };
  return (
    <BrowserRouter>
      <Provider template={AlertTemplate} {...alertOptions}>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
