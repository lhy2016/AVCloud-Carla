import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Link, useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Navbar from "./Navbar";
import '../css/dashboard.css';

class RentFromComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { vehicleId } = this.props;
    // const { match: { params: { vehicleId } } } = this.props;
    return (
      <Container className="content-container">
        <Navbar active="rent"/>
        This is rent form for vehicleId: {vehicleId}
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
