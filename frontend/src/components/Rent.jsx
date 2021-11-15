import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Navbar from "./Navbar";
import '../css/dashboard.css';

const GET_AVAILABLE_VEHICLES_API = '/vehicles/getAllAV/';

class RentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableVehicles: [],
    };
  }

  componentDidMount() {
    axios.get(GET_AVAILABLE_VEHICLES_API)
      .then((response) => {
        const { data: vehicles } = response;
        const availableVehicles = vehicles.map((vehicle) => {
          const { pk, fields: { make, color, name } } = vehicle;
          return {
            vehicleId: pk,
            name,
            make,
            color,
          };
        });
        this.setState({ availableVehicles });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  showAvaliabeVehicles = () => {
    
  }

  render() {
    const { availableVehicles } = this.state;
    return(
      <Container className="content-container">
        <Navbar active="rent"/>
        <Row style={{marginTop:"20px"}}>
          <Col md="10">
            <h4>Select the AV you want to rent</h4>
          </Col>
          <Table striped bordered hover style={{marginTop:"30px"}}>
            <thead>
              <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Make</th>
                  <th>Color</th>
                  <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {
                availableVehicles.map((av) => (
                  <tr key={av.pk}>
                    <td>{av.vehicleId}</td>
                    <td>{av.name}</td>
                    <td>{av.make}</td>
                    <td>{av.color}</td>
                    <td style={{display:"flex"}}>
                      <Link to={'/rent/'+av.vehicleId} className='ops-links'>Rent</Link>
                    </td>
                  </tr>)
                )
              }
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export default RentComponent;