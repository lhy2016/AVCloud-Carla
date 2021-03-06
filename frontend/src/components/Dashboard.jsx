import { Row, Col, Button, Modal, Form, Table} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../css/dashboard.css";
import { Link } from "react-router-dom";
import React, {useEffect, useState} from "react";
import Navbar from "./Navbar";
import axios from "axios"
import "../js/config"
import { getCookie } from "../js/utilities";
import { useAlert } from 'react-alert'

function Dashboard(props) {
    const isAdmin = (getCookie("loggedUser") === 'admin')
    const UserID = getCookie("userId")
    const alert = useAlert()  
    const [AVs, getAVs] = useState([]);
    const [initStates, setInitStates] = useState([]);
    const [VehicleList, userRentalList] = useState([]);

    const getUserRentalList = () => {
        axios.get("/vehicles/getUserRentalHistory/" + UserID)
        .then((response)=>{
            console.log("Inside response function")
            // console.log(response.data)
            var vehicleList = response.data;
            console.log(typeof(vehicleList))
            userRentalList(vehicleList)
        })
        .catch((error)=> {
            console.log(error.response)
        })
    };

    function updateAVs() {
        var queryAPI = (isAdmin ? "/vehicles/getAllAV/" : "/vehicles/getAllAV/")
        axios.get(queryAPI)
        .then((response)=>{
            var vehicleObjs = response.data;
            vehicleObjs.map((element)=> {
                element["selected"] = false;
                return element;
            })
            getAVs(vehicleObjs)
            setInitStates(vehicleObjs.map((element)=>element.fields.status))
        })
        .catch((err)=> {
            console.log(err.response)
        })
    }    
    useEffect(()=> {
        getUserRentalList();
        updateAVs();
    }, []);

    const defaultCar = {name:"", make:"0", color:"0"}
    const [show, setShow] = useState(false);
    const [carInput, updateCar] = useState(Object.assign(defaultCar))
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function update(name, value) {
        updateCar({ ...carInput, [name]: value});
    }
    function submitCar() {
        axios.post("/vehicles/add_vehicle", carInput)
        .then((response)=> {
            if (response.status == 200) {
                var car = JSON.parse(response.data)[0]
                alert.success("Sucessfully created vehicle: " + car.fields.name)
                updateAVs()
            }
        })
        .catch((err)=> {
            console.log(err);
            // alert.error(err);
        });
        updateCar(defaultCar);
        handleClose()
    }
    function deleteCars() {
        for (var av of AVs.filter((av)=>av.selected)) {
            deleteCar(av.pk);
        }
        
    }
    function deleteCar(vehicle_id) {
        console.log(vehicle_id);
        axios.delete("/vehicles/remove/"+vehicle_id)
        .then((response)=> {
            if (response.status === 200) {
                var car = JSON.parse(response.data)[0]
                alert.success("Sucessfully deleted vehicle: " + car.fields.name)
                updateAVs()
            }
        })
        .catch((err)=> {
            console.log(err);
        })
    }

    function updateChecked(index) {
        let newArr = [...AVs];
        newArr[index].selected = !newArr[index].selected
        getAVs(newArr) 
    }
    function handleChangeStatus(index, value) {
        if (AVs[index].fields.status === initStates[index] && !AVs[index].selected) {
            updateChecked(index)
        } else if (AVs[index].fields.status !== initStates[index] && AVs[index].selected) {
            updateChecked(index)
        }
        let newArr = [...AVs];
        newArr[index].fields.status = value;
        getAVs(newArr)
        
    }
    function submitStatus() {
         for(var vehicle of AVs.filter((av)=>av.selected)) {
            axios.post("/vehicles/updateAVstatus/", {"id": vehicle.pk, "status": vehicle.fields.status})
            .then((response) => {
                if(response.status === 200) {
                    alert.success("Successfully change status of the vehicle " + vehicle.fields.name);
                    updateAVs()
                }
            })
            .catch((err)=> {
                console.log(err);
                alert.error("Error: " + err);
            })
         } 
    }

    return(
    <Container className="content-container">
        {/* {["a","b","c"].map(element=>(<h1>{element}</h1>))} */}
        <Navbar active="dashboard"/>
        <Row style={{marginTop:"20px"}}>
            <Col md="10">
                <h4>{isAdmin? "AV status":"Your Rental Vehicle"}</h4>
            </Col>
            <Col>
                {isAdmin?
                    <Button variant="warning" onClick={handleShow}>Add a New AV</Button>:
                    <></>}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add a New AV</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control placeholder="Enter a name" value={carInput["name"]} onChange={(e)=>update("name", e.target.value)}>
                        </Form.Control>
                        <Form.Select aria-label="make" style={{marginTop: "8px"}} value={carInput["make"]} onChange={(e)=>{update("make", e.target.value)}}>
                            <option value="0">Select Make</option>
                            <option value="mini">Mini Cooper</option>
                            <option value="tesla">Tesla</option>
                            <option value="audi">Audi</option>
                        </Form.Select>
                        <Form.Select aria-label="color" style={{marginTop: "8px"}} value={carInput["color"]} onChange={(e)=>{update("color", e.target.value)}}>
                            <option value="0">Select Color</option>
                            <option value="yellow">Yellow</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="silver">Silver</option>
                        </Form.Select>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitCar}>
                        Add
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </Col>
         
            {isAdmin ?
            <Col md="5"style={{marginTop: "20px"}} style={{height:"43px"} }>
                <div style={{display:AVs.filter(av=>av.selected).length > 0 ? "block": "none"}}>
                <Button varient="info" style={{marginRight: "7px"}} onClick={submitStatus}> Update</Button>
                <Button variant="danger" onClick={deleteCars}>Delete</Button>
                </div>
            </Col>:
            <></>
            }
          
            <Table striped bordered hover style={{marginTop:"20px"}}>
                    <thead>
                        <tr>
                            {isAdmin?<th> </th>:<></>}
                            <th>id</th>
                            <th>Name</th>
                            <th>Make</th>
                            <th>Color</th>
                            <th>Create Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AVs.map((element, index) => 
                            (<tr key={element.pk} onClick={()=>{updateChecked(index)}}>
                                {isAdmin ? <td >
                                    <Form.Check checked={element.selected} onClick={(e)=>{e.stopPropagation()}} onChange={()=> {updateChecked(index)}} />
                                </td> : <></>}
                                <td>{element.pk}</td>
                                <td>{element.fields.name}</td>
                                <td>{element.fields.make.charAt(0).toUpperCase()+element.fields.make.slice(1)}</td>
                                <td>{element.fields.color}</td>
                                <td>{element.fields.created_on}</td>
                                <td>
                                    <Form.Select aria-label="status" disabled={!isAdmin} value={element.fields.status} 
                                                                     onClick={(e)=>{e.stopPropagation()}} onChange={(e)=>{handleChangeStatus(index, e.target.value)}}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Select>
                                </td>
                            </tr>)
                        )}
                    </tbody>
                </Table>
        </Row>
        <Row>
            <h4>Your Rental History</h4>
            <Table striped bordered hover style={{marginTop:"20px"}}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Make</th>
                            <th>Time Started</th>
                            <th>Time Finished</th>
                            <th>Distance</th>
                            <th>Duration</th>
                            <th>Created On</th>

                        </tr>
                    </thead>
                    <tbody>
                        { VehicleList.map((element, index) => 
                            (<tr key={element.id}>
                                <td>{element.id}</td>
                                <td>{element.vehicle_id_name}</td>
                                <td>{element.vehicle_id_make}</td>
                                <td>{element.time_started}</td>
                                <td>{element.time_finished}</td>
                                <td>{element.distance}</td>
                                <td>{element.duration}</td>
                                <td>{element.vehicle_id_created_on}</td>
                            </tr>)
                        )}
                    </tbody>
            </Table>
        </Row>
    </Container>)
}
export default Dashboard;