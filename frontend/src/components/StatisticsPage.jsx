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

const GET_LIST_OF_USERS      = '/vehicles/getNumberOfUsers/';
const NUMBER_OF_LIVE_RENTALS = '/vehicles/getNumberOfActiveRentals/';

class StatisticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfUsers: [],
      numberOfLiveRentals: 0,
    };
  }

  componentDidMount() {
      axios.get(GET_LIST_OF_USERS)
        .then((response) => {
          console.log(response.data)
          const { data: users } = response;
          const listOfUsers = users.map((users) => {
            const { fields: { username, create_on} } = users;
            return {
              username,
              create_on,
            };
          });
          this.setState({ listOfUsers });
        })
        .catch((err) => {
          console.error(err);
        });

        axios.get(NUMBER_OF_LIVE_RENTALS)
        .then((response) => {
          console.log(response.data)
          const { data: numberOfLiveRentals } = response;
          this.setState({ numberOfLiveRentals });
        })
        .catch((err) => {
          console.error(err);
        });  
  }

  showAvaliabeVehicles = () => {
    
  }

  render() {
    const { listOfUsers }         = this.state;
    const { numberOfLiveRentals } = this.state
    return(
      <Container className="content-container">
        <Navbar active="statistics"/>

        <Row style={{marginTop:"20px"}}>
          <Col md="10">
            <h4>Registered Users</h4>
          </Col>
          <Table striped bordered hover style={{marginTop:"30px"}}>
            <thead>
              <tr>
                  <th>Username</th>
                  <th>Date of creation</th>
              </tr>
            </thead>
            <tbody>
              {
                listOfUsers.map((av, index) => (
                  <tr key={index}>
                    <td>{av.username}</td>
                    <td>{av.create_on}</td>
                  </tr>)
                )
              }
            </tbody>

          </Table>
        </Row>
        <Row>
            <Col md="10">
                <h4> Current Live Rentals: {numberOfLiveRentals}</h4>
            </Col>
            
        </Row>
      </Container>
    );
  }
}

export default StatisticsComponent;