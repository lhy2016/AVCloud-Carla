import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../css/dashboard.css';
import Navbar from './Navbar';

const GET_VEHICLES_API = '/vehicles/getAllAV/';
const GET_ALL_SERVICE_HISTORY_API = '/vehicles/getServiceHistory/';
const ADD_SERVICE_RECORD_API = '/vehicles/addServiceRecord/'

class MaintenanceRecordComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vehicleIds: undefined,
      selectedVehicleRecords: undefined,

      selectedVehicleId: undefined,
      addRecordStatus: undefined,
    };
  }

  componentDidMount() {
    let newState = {};
    axios.get(GET_VEHICLES_API)
    .then((response) => {
      // Parse veheicleIds from response
      const { status, statusText, data: vehicles } = response;
      if (status !== 200) throw new Error(`Expect ${GET_VEHICLES_API} responses 200 instead of ${status}: ${statusText}`);
      if (!Array.isArray(vehicles)) console.warn('[Maintenance] vehicleIds is not an array');
      const vehicleIds = vehicles.map((v) => v.pk);

      // Save vehicleIds to new state
      newState = Object.assign(newState, { vehicleIds });

      if (vehicleIds.length === 0) {
        return Promise.resolve();
      }
      // Default select the first vehicle in the list
      const selectedVehicleId = vehicleIds[0];
      newState = Object.assign(newState, { selectedVehicleId });

      return axios.get(GET_ALL_SERVICE_HISTORY_API, { params: {vehicle_id: selectedVehicleId} });
    })
    .then((response) => {
      const { status, statusText, data: records } = response;
      if (status !== 200) throw new Error(`Expect ${GET_ALL_SERVICE_HISTORY_API} responses 200 instead of ${status}: ${statusText}`);
      if (!Array.isArray(records)) console.warn('[Maintenance] vehicleIds is not an array');

      // [{"model": "api.maintenancerecord", "pk": 1, "fields": {"vehicle_id": 1, "date": "2021-11-02T07:36:31Z", "detail": "Oil change"}}]
      // =>
      // [ {"date": "2021-11-02T07:36:31Z", "detail": "Oil change"}]
      const selectedVehicleRecords = records.map((record) => {
        const { fields } = record;
        delete fields.vehicle_id;
        return fields;
      });

      // Save selectedVehicleRecords to new state
      newState = Object.assign(newState, { selectedVehicleRecords });

      // Update state to the new state
      this.setState(newState);
    })
    .catch((err) => {
      console.error('[Maintenance] Failed to get list of vehicles in componentDidMount', err);
    })

  }

  showMaintainenceRecord = (record) => {
    const keys = Object.keys(record);
    return (
      <>
        {keys.map((key) => (
          <Row key={key}>
            <Col>{key}</Col>
            <Col>{record[key]}</Col>
          </Row>
        ))}
      </>
    );
  }

  showSelectedVehicleMaintainenceRecords = () => {
    const { selectedVehicleRecords: records = [] } = this.state;
    return (
      <Card>
        <Card.Title>Maintenance data</Card.Title>
        <Card.Body>
          {records.map((record) => (<Row className="mb-1 border-bottom">{this.showMaintainenceRecord(record)} </Row>))}
        </Card.Body>
      </Card>
    )
  }

  showDropDwonList = () => {
    const { vehicleIds = [], selectedVehicleId } = this.state;
    return (
      <Form>
        <Form.Label>Select the AV you want to maintain</Form.Label>
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

  showAddNewRecordForm = () => {
    const { date, detail } = this.state;
    return (
      <Form>
        <Form.Group className="mx-3 my-3">
          <Form.Label>Maintenance Date</Form.Label>
          <Form.Control
            name="date"
            value={date}
            placeholder="2020-11-11"
            onChange={this.formOnChangeHandler}
            required
          />
          <Form.Label>Details</Form.Label>
          <Form.Control
            name="detail"
            value={detail}
            placeholder="details"
            onChange={this.formOnChangeHandler}
            required
          />
        </Form.Group>
        <Form.Group className="mx-3 my-3">
          <Button variant="primary" onClick={this.formOnSubmitHandler}>
            Add new record
          </Button>
        </Form.Group>
      </Form>
    )
  }

  showAddRecordStatusModal = () => {
    const { addRecordStatus } = this.state;
    const show = addRecordStatus ? true : false;
    const statusText = addRecordStatus ? addRecordStatus.statusText : '';

    return (
      <Modal
        show={show}
        onHide={this.modalCloseHandler}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Record Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statusText}
        </Modal.Body>
      </Modal>
    );
  }

  modalCloseHandler = () => {
    this.setState({
      addRecordStatus: undefined,
    });
  }

  formOnChangeHandler = (event) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value,
    });
  }

  formOnSubmitHandler = (event) => {
    event.preventDefault();
    const { selectedVehicleId, date, detail } = this.state;
    const params = new URLSearchParams();
    params.append('vehicle_id', selectedVehicleId);
    params.append('date', date);
    params.append('detail', detail);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    let newState = {};
    axios.post(ADD_SERVICE_RECORD_API, params, config)
      .then((response) => {
        const { status, statusText } = response;
        if (status !== 200) throw new Error(`Expect ${ADD_SERVICE_RECORD_API} responses 200 instead of ${status}: ${statusText}`);
        newState = Object.assign(newState, { addRecordStatus: { statusText } });

        // Mock drop down on change event to reload data from server
        this.dropDownOnChangeHandler({ target: { name: 'selectedVehicleId', value: selectedVehicleId } });
      })
      .catch((err) => {
        const { response = { statusText: err.message } } = err;
        const { statusText } = response;
        newState = Object.assign(newState, { addRecordStatus: { statusText } });
      })
      .finally(() => {
        this.setState(newState);
      })
  }

  dropDownOnChangeHandler = (event) => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value,
      selectedVehicleRecords: undefined,
    });

    let newState = {};
    axios.get(GET_ALL_SERVICE_HISTORY_API, { params: {vehicle_id: value} })
    .then((response) => {
      const { status, statusText, data: records } = response;
      if (status !== 200) throw new Error(`Expect ${GET_ALL_SERVICE_HISTORY_API} responses 200 instead of ${status}: ${statusText}`);
      if (!Array.isArray(records)) console.warn('[Maintenance] vehicleIds is not an array');

      // [{"model": "api.maintenancerecord", "pk": 1, "fields": {"vehicle_id": 1, "date": "2021-11-02T07:36:31Z", "detail": "Oil change"}}]
      // =>
      // [ {"date": "2021-11-02T07:36:31Z", "detail": "Oil change"}]
      const selectedVehicleRecords = records.map((record) => {
        const { fields } = record;
        delete fields.vehicle_id;
        return fields;
      });

      // Save selectedVehicleRecords to new state
      newState = Object.assign(newState, { selectedVehicleRecords });

      // Update state to the new state
      this.setState(newState);
    })
    .catch((err) => {
      console.error('[Maintenance] Failed to get list of vehicles in componentDidMount', err);
    })
  }

  render() {
    console.log(this.state);
    return (
      <Container className="content-container">
        <Navbar active="maintenancerecord"/>
          {this.showAddRecordStatusModal()}
          {this.showDropDwonList()}
          {this.showAddNewRecordForm()}
          {this.showSelectedVehicleMaintainenceRecords()}
      </Container>
    );
  }
}

export default MaintenanceRecordComponent;
