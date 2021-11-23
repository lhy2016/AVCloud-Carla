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
import rd3 from 'react-d3-library';
import * as d3 from "d3";
// import '../js/barchart'
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


const GET_LIST_OF_USERS      = '/vehicles/getNumberOfUsers/';
const NUMBER_OF_LIVE_RENTALS = '/vehicles/getNumberOfActiveRentals/';
const LIVE_RENTAL_PER_USER   = '/vehicles/getNumberOfActiveRentalsPerUser/';
const hold_labels = [];
const number_of_live_per_user = [];
const test_data = {
    labels: ['Admin', 'User', 'Testersss'],
    datasets: [
      {
        label: 'Current Rental Vehicles',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [70, 0, 0]
      }
    ]
  }

class StatisticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfUsers: [],
      numberOfLiveRentals: 0,
      real_labels: [],
      render: false,
    };
  }

  

  componentDidMount() {
    setTimeout(function() {
        this.setState({render: true})
    }.bind(this), 2000)

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
          this.setState({listOfUsers});

          users.map((users) => {
            const {fields: {username} } = users;
            console.log("Inside map");
            console.log(username);
            hold_labels.push(username);
          });
          console.log("INSIDE ASSIGN");
    
        })
        .catch((err) => {
          console.error(err);
        });

        axios.get(NUMBER_OF_LIVE_RENTALS)
        .then((response) => {
          console.log("INSIDE NUMBER OF LIVE RENTALS")
          console.log(response.data)
          const { data: numberOfLiveRentals } = response;
          this.setState({ numberOfLiveRentals });
        })
        .catch((err) => {
          console.error(err);
        });  


        // const listOfUsers = users.map((users) => {
        //     const { fields: { username, create_on} } = users;
        //     return {
        //       username,
        //       create_on,
        //     };
        //   });

        axios.get(LIVE_RENTAL_PER_USER)
        .then((response) => {
            console.log("INSIDE LIVE RENTAL PER USER");
            // console.log(response.data)
            const { data: user_data } = response;
            console.log(user_data)
            Object.keys(user_data).forEach(function(key) {
                number_of_live_per_user.push(user_data[key]);
              });
              console.log("ARRAY INSIDE LIVE RENTAL IS");
              console.log(number_of_live_per_user);
            // user_data.map((user) => {
            //     console.log("WHAT ARE USERS")
            //     console.log(user)
            // });
        })
        .catch((err) => {
            console.error(err);
        });  

  }

  render() {

    const { listOfUsers }         = this.state;
    
    const { numberOfLiveRentals } = this.state;
    const { real_labels }         = this.state;
    console.log("hold labels is");
    console.log(hold_labels)
    test_data.labels = hold_labels;
    // test_data.datasets[0].data = number_of_live_per_user;
    console.log("Type of array data is: ");
    console.log(number_of_live_per_user);
    console.log("Array length is:");
    console.log(number_of_live_per_user.length);
    var temp_array = [];
    for(var i = 0; i < number_of_live_per_user.length; i++){
        console.log(number_of_live_per_user[i]);
        temp_array.push(number_of_live_per_user[i]);
    }
    test_data.datasets[0].data = temp_array;
    console.log(test_data.datasets[0].data);

    let renderTimer = false

    if(this.state.render) {
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
              <div>
                  <h3>Bar Chart</h3>
                  <div id="chart">
                  </div>
              </div>
              <div>
              <Bar
                data={test_data}
                options={{
                  title:{
                    display:true,
                    text:'All rental by current users',
                    fontSize:20
                  },
                  legend:{
                    display:true,
                    position:'right'
                  }
                }}
              />
            </div>
            </Container>
            
      
          );
    }
    return (
        renderTimer //Render the dom elements, or, when this.state == false, nothing.
      )

   
  }
}

export default StatisticsComponent;