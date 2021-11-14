import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import '../css/dashboard.css';
import Navbar from './Navbar';


const GET_VEHICLES_API = '/vehicles/getAllAV/'
const GET_VEHICLE_SENSOR_DATA_API = '/get/vehicle/sensordata';

const REFRESH_TIME_MS = 5000;

class TrackComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleIds: undefined,
      sensorDataOfSelectedVehicle: undefined,

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

      // TODO: Send request to get vehicle sensor data
      // const params = { vehickeId, userId };
      // return axios.get(GET_VEHICLE_SENSOR_DATA_API, params);
      return Promise.resolve({ 
        status: 200,
        data: { vehicleId: selectedVehicleId, seepd: '66 miles/hr', location: 'N:123 W:567'},
      }); // mock data
    })
    .then((response) => {

      // Parse sensorData from response
      const { status, statusText, data: sensorData } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLE_SENSOR_DATA_API} responses 200 instead of ${status}: ${statusText}`);
      
      // Save sensorData to new state
      newState = Object.assign(newState, { sensorDataOfSelectedVehicle: sensorData });
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
    this.dropDownOnChangeHandler({
      target: {
        name: 'selectedVehicleId',
        value: selectedVehicleId
      },
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
    const keys = Object.keys(sensorDataOfSelectedVehicle);
    return (
      <Card>
        <Card.Title>Sensor data</Card.Title>
        <Card.Body>
          {keys.map((key) => (
            <Row key={key}>
              <Col>{key}</Col>
              <Col>{sensorDataOfSelectedVehicle[key]}</Col>
            </Row>
          ))}
        </Card.Body>
      </Card>
    )
  }

  dropDownOnChangeHandler = (event) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value,
    });
    // TODO: Send request to get vehicle sensor data
    // const params = { vehicleId: value, userId };
    // return axios.get('/get/vehicle/sensor/data', params);
    Promise.resolve({ 
      status: 200,
      data: { vehicleId: value, seepd: '66 miles/hr', location: 'N:456 W:768', debug: value},
    })
    .then((response) => {

      // Parse sensorData from response
      const { status, statusText, data: sensorData } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLE_SENSOR_DATA_API} responses 200 instead of ${status}: ${statusText}`);

      // Update state to the new state
      this.setState({ sensorDataOfSelectedVehicle: sensorData });
    });
  }

  render() {
    return (
      <Container className="content-container">
        <Navbar active="track"/>
          {this.showDropDwonList()}
          {this.showSelectedVehicleSensorData()}
      </Container>
    );
  }
}

export default TrackComponent;
