import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import {
  LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import '../css/dashboard.css';
import Navbar from './Navbar';


const GET_VEHICLES_API = '/vehicles/getAllAV/'
const GET_VEHICLE_SENSOR_DATA_API = '/vehicles/carlaUpdate/';

const REFRESH_TIME_MS = 1000;

function toFixedDecimalStr(v) {
  return Number.isNaN(Number(v)) ? 'N/A' : v.toFixed(2);
}

class TrackComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleIds: undefined,
      sensorDataOfSelectedVehicle: undefined,
      sensorDataHistory: [],

      selectedVehicleId: undefined,
    };
  }

  componentDidMount() {
    let newState = {};
    axios.get(GET_VEHICLES_API, {})
    .then((response) => {
      // Parse veheicleIds from response
      const { status, statusText, data: vehicles } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLES_API} responses 200 instead of ${status}: ${statusText}`);
      if (!Array.isArray(vehicles)) console.warn('[TRACK] vehicleIds is not an array');
      const vehicleIds = vehicles.map((v) => v.pk);

      // Save vehicleIds to new state
      newState = Object.assign(newState, { vehicleIds });

      
      if (vehicleIds.length === 0) {
        return Promise.resolve();
      }
      // Default select the first vehicle in the list
      const selectedVehicleId = vehicleIds[0];
      newState = Object.assign(newState, { selectedVehicleId });

      const params = { vehicle_id: selectedVehicleId };
      return axios.get(GET_VEHICLE_SENSOR_DATA_API, { params });
    })
    .then((response) => {

      // Parse sensorData from response
      const { status, statusText, data: sensorData } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLE_SENSOR_DATA_API} responses 200 instead of ${status}: ${statusText}`);
      
      // Save sensorData to new state
      newState = Object.assign(newState, { sensorDataOfSelectedVehicle: sensorData, sensorDataHistory: [sensorData] });
    })
    .catch((err) => {
      console.error('[TRACK] Failed to get list of vehicles in componentDidMount', err);
    })
    .finally(() => {
      const refreshTimer = setInterval(() => this.refreshHandler(), REFRESH_TIME_MS);
      newState = Object.assign(newState, { refreshTimer });
      // Update state to the new state
      this.setState(newState);
    });
    ;
  }

  componentWillUnmount() {
    const { refreshTimer } = this.state;
    if (refreshTimer) clearInterval(refreshTimer);
  }

  refreshHandler = () => {
    // Mock drop down on change event to reload data from server
    const { selectedVehicleId } = this.state;
    console.log('refreshing ...');
    const params = { vehicle_id: selectedVehicleId };
    axios.get(GET_VEHICLE_SENSOR_DATA_API, { params }, { timeout: Math.round(REFRESH_TIME_MS/2) })
      .then((response) => {
        const { status, statusText, data: sensorData } = response;
        if (status !== 200) throw new Error(`Expect ${GET_VEHICLE_SENSOR_DATA_API} responses 200 instead of ${status}: ${statusText}`);
        this.setState((state) => {
          const { sensorDataHistory = [] } = state;
          sensorDataHistory.push(sensorData);
          if (sensorDataHistory.length > 10) sensorDataHistory.shift();
          return { sensorDataOfSelectedVehicle: sensorData, sensorDataHistory };
        });
      });
  }

  showDropDwonList = () => {
    const { vehicleIds = [], selectedVehicleId } = this.state;
    return (
      <Form>
        <Form.Label>Select the AV you want to monitor</Form.Label>
        <Form.Select
          value={selectedVehicleId}
          name="selectedVehicleId"
          onChange={this.dropDownOnChangeHandler}
        >
          {
            vehicleIds.map((vehicleId, index) => (
              <option key={vehicleId} value={vehicleId}>
                {`${index + 1}. AV number ${vehicleId}`}
              </option>))
          }
        </Form.Select>
      </Form>
    );
  }

  showSelectedVehicleSensorData = () => {
    const { sensorDataOfSelectedVehicle = {} } = this.state;
    const { speed, location = {} }  = sensorDataOfSelectedVehicle;

    return (
      <Card>
        <Card.Title>Sensor data</Card.Title>
        <Card.Body>
          <Row>
            <Col>Speed</Col>
            <Col>{toFixedDecimalStr(speed)}</Col>
          </Row>
          <Row>
            <Col>Location</Col>
            <Col>{`( ${toFixedDecimalStr(location.x)},  ${toFixedDecimalStr(location.y)} )`}</Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }

  dropDownOnChangeHandler = (event) => {
    const { target: { name, value: vehicleId } } = event;
    this.setState({
      [name]: vehicleId,
    });

    const params = { vehicle_id: vehicleId };
    axios.get(GET_VEHICLE_SENSOR_DATA_API, { params })
      .then((response) => {
        const { status, statusText, data: sensorData } = response;
        if (status !== 200) throw new Error(`Expect ${GET_VEHICLE_SENSOR_DATA_API} responses 200 instead of ${status}: ${statusText}`);
        this.setState({ sensorDataOfSelectedVehicle: sensorData, sensorDataHistory: [sensorData] });
      });
  }

  showGraph = () => {
    const { sensorDataHistory = [] } = this.state;
    const data = sensorDataHistory.map((sensorData) => ({name: '', value: sensorData.speed}));
    const color='#0095FF';
    return (
      <>
        <Row>
          <h4>Speed</h4>
        </Row>
        <Row>
          <LineChart width={600} height={450} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={color} />
          </LineChart>
        </Row>
      </>
    );
  }

  render() {
    return (
      <Container className="content-container">
        <Navbar active="track"/>
          {this.showDropDwonList()}
          {this.showSelectedVehicleSensorData()}
          {this.showGraph()}
      </Container>
    );
  }
}

export default TrackComponent;
