import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Link, useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Navbar from "./Navbar";
import '../css/rentForm.css';
import {FaMapMarkerAlt} from "react-icons/fa";

class RentFromComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarker: "pickup",
    };
  }

  componentDidMount() {
    // console.log(this.props);
  }

  render() {
    const { vehicleId } = this.props;
    // const { match: { params: { vehicleId } } } = this.props;
    return (
      <Container className="content-container">
        <Navbar active="rent"/>
        <Row style={{marginTop:"50px"}}>
          <h4>Select Pickup location and Destination</h4>
          <Col md="4">
          <div className="pic-des-container"> 
            <span> Now select: </span>
            <Form.Select aria-label="Default select example" style={{width: "200px"}} 
                value={this.state.selectedMarker} onChange={(e)=>{this.setState({selectedMarker: e.target.value})}}>
              <option value="pickup">Pickup</option>
              <option value="dest">Destination</option>
            </Form.Select>
            <FaMapMarkerAlt id="select-marker" className={this.state.selectedMarker}/>
          </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

function RentFormWrapper(props) {
  const { vehicleId } = useParams();
  return (
    <RentFromComponent {...props} vehicleId={vehicleId} />
  );
}

export default RentFormWrapper;
