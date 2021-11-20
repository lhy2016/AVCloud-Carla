import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Link, useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button"
import Navbar from "./Navbar";
import '../css/rentForm.css';
import {FaMapMarkerAlt, FaWindows} from "react-icons/fa";
import "../js/config"
import { getCookie } from "../js/utilities"

class RentFromComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMarker: "pickup",
      pickupCoord: {x:-1,y:-1},
      destCoord: {x:-1,y:-1},
    };
  }

  componentDidMount() {
  }
  
  updateCoord = (e, coord) => {
    var bounds = e.target.getBoundingClientRect();
    var coordX = e.clientX - bounds.left;
    var coordY = e.clientY - bounds.top;
    if (coord == "pickup") {
      this.setState({
        pickupCoord: {x:coordX, y:coordY}
      })
    } else {
      this.setState({
        destCoord: {x:coordX, y: coordY}
      })
    }
  };
  submitCoord = () => {
    var input = {}
    input["pickup"] = {
      x: this.state.pickupCoord.x / 485,
      y: this.state.pickupCoord.y / 500
    }
    input["dest"] = {
      x: this.state.destCoord.x / 485,
      y: this.state.destCoord.y / 500
    }
    input["vehicle_id"] = parseInt(this.props.vehicleId)
    input["user_id"] = parseInt(getCookie("userId"))
    axios.post(window.serverPrefix + "vehicles/rent_vehicle", input)
    .then((response)=>{
      if (response.status == 200) {
        var ret = JSON.parse(response.data)[0];
        var date = new Date();
        date.setDate(date.getDate() + 7);
        var dateString = date.toUTCString()
        document.cookie = "active_rental=" + JSON.stringify(ret) +"; expires="+dateString+"; path=/";
        window.location.href = "/rent"
      }
    }).catch((err)=> {
      console.log(err);
    })
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
          <div className="map-container" onClick={(e)=>{this.updateCoord(e, this.state.selectedMarker)}}>
              <FaMapMarkerAlt className="marker pickup" 
                style={this.state.pickupCoord.x == -1 && this.state.pickupCoord.y == -1 ? 
                  {display:'none'} : 
                  {display:'block',
                   top: this.state.pickupCoord.y,
                   left: this.state.pickupCoord.x}}>  </FaMapMarkerAlt>
              <FaMapMarkerAlt className="marker dest"
                style={this.state.destCoord.x == -1 && this.state.destCoord.y == -1 ? 
                  {display: 'none'}: 
                  {display:'block',
                   top: this.state.destCoord.y,
                   left: this.state.destCoord.x}}>  </FaMapMarkerAlt>
          </div>
          
          </Col>
          
        </Row>
        <Col style={{marginTop:"20px"}}>
          <Button onClick={this.submitCoord}>Rent </Button>
        </Col>
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
