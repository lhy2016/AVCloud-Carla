import Landing from "./Landing"
import Dashboard from "./Dashboard";
import Rent from "./Rent";
import RentForm from './RentForm';
import Track from "./Track";
import MaintenanceRecord from './MaintenanceRecord';
import Statistics from './StatisticsPage'
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../css/main.css";
import "../js/config"

function App() {
  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    containerStyle: {
    }
  };


  return (
    <div id="site-container">
    <BrowserRouter>
      <Provider template={AlertTemplate} {...alertOptions}>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/dashboard' element={<Dashboard/>} />
          <Route exact path='/rent' element={<Rent/>} />
          <Route exact path='/rent/:vehicleId' element={<RentForm />} />
          <Route exact path='/track' element={<Track />} />
          <Route exact path='/maintenancerecord' element={<MaintenanceRecord />} />
          <Route exact path='/statistics' element={<Statistics />} />

        </Routes>
      </Provider>
    </BrowserRouter>
    </div>
  );
}

export default App;
