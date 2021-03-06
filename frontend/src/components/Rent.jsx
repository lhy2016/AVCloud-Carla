import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Navbar from "./Navbar";
import '../css/dashboard.css';
import '../js/config'
import {getCookie} from '../js/utilities'

const GET_AVAILABLE_VEHICLES_API = '/vehicles/getAvailableAV/';

class RentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableVehicles: [],
      is_renting : (getCookie("active_rental") !== undefined),
      active_rental: getCookie("active_rental") !== undefined ? JSON.parse(getCookie("active_rental")) : null ,
    };
  }

  componentDidMount() {
    if (!this.state.is_renting) {
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
    } else {
      var intervalId = setInterval(
        ()=> {
          var rental_obj = JSON.parse(getCookie("active_rental"));
          axios.get("/vehicles/getRentalStatus/" + rental_obj["pk"])
          .then((response)=> {
            if (response.status == 200) {
              var ret = response.data[0];
              console.log(ret);
              this.setState({
                active_rental: ret
              });
              if (ret.fields.process === "arrived") {
                alert("Arrived the destination\n\
                       time started: " + ret.fields.time_started + "\n\
                       time finished: " + ret.fields.time_finished + "\n\
                       From: " + ret.fields.pickup_coord + "\n\
                       To: " + ret.fields.dest_coord + "\n\
                       Duration: " + ret.fields.duration + " seconds");
                clearInterval(intervalId)
                document.cookie = "active_rental=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/rent"
              }
            }
          })
      .catch((err)=> {
        console.log(err);
      })
        },1000
      )
      
    }
  }

  showAvaliabeVehicles = () => {
    
  }

  render() {
    const { availableVehicles } = this.state;
    return(
      <Container className="content-container">
        <Navbar active="rent"/>

        {!this.state.is_renting ?
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
                availableVehicles.map((av, index) => (
                  <tr key={index}>
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
        :
        <Row style={{marginTop:"20px"}}>
          <Col md="10">
            <h4>Your current Rental Vehicle</h4>
          </Col>
          <Table striped bordered hover style={{marginTop:"30px"}}>
            <thead>
              <tr>
                  <th>Name</th>
                  <th>Make</th>
                  <th>Color</th>
                  <th>Status</th>
                  <th>Start</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.active_rental.fields.name}</td> 
                <td>{this.state.active_rental.fields.make}</td>
                <td>{this.state.active_rental.fields.color}</td>
                <td>{this.state.active_rental.fields.process}</td>
                <td>{this.state.active_rental.fields.time_started}</td>
              </tr>
            </tbody>
          </Table>
        </Row>
        }
      </Container>
    );
  }
}

export default RentComponent;