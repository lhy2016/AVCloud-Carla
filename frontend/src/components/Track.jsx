import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import '../css/dashboard.css';
import Navbar from './Navbar';


const GET_VEHICLES_API = '/get/vehicles'
const GET_VEHICLE_SENSOR_DATA_API = '/get/vehicle/sensordata';

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
    // TODO: Send request to get list of vehicles
    // const params = { admin, userId };
    // axios.get(GET_VEHICLES_API, params)
    
    Promise.resolve({ status: 200, data: ['vehicle_id_0', 'vehicle_id_1']}) // mock data
    .then((response) => {

      // Parse veheicleIds from response
      const { status, statusText, data: vehicleIds } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLES_API} responses 200 instead of ${status}: ${statusText}`);
      if (!Array.isArray(vehicleIds)) console.warn('[TRACK] vehicleIds is not an array');

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

      // Update state to the new state
      this.setState(newState);
    })
    .catch((err) => {
      console.error('[TRACK] Failed to get list of vehicles in componentDidMount', err);
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
                {`${index}. AV number ${vehicleId}`}
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
    console.log(name, value);
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
