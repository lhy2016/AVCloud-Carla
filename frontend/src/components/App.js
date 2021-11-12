import Landing from "./Landing"
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "../css/main.css";

function App() {
  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    containerStyle: {
    }
  };
  return (
    <Provider template={AlertTemplate} {...alertOptions}>
      <div className="App">
        <Landing>
        </Landing>
      </div>
    </Provider>
  );
}

export default App;
