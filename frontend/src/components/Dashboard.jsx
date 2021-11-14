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
    const alert = useAlert()  
    const [AVs, getAVs] = useState([]);
    function updateAVs() {
        axios.get(window.serverPrefix + "vehicles/getAllAV/")
        .then((response)=>{
            getAVs(response.data)
        })
        .catch((err)=> {
            console.log(err.response)
        })
    }    
    useEffect(()=> {
        updateAVs()
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
        axios.post(window.serverPrefix+"vehicles/add_vehicle", carInput)
        .then((response)=> {
            console.log(response)
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

    function deleteCar(vehicle_id) {
        console.log(vehicle_id);
        axios.get(window.serverPrefix+"vehicles/remove/"+vehicle_id)
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

    const isAdmin = (getCookie("loggedUser") === 'admin')
    return(
    <Container className="content-container">
        {/* {["a","b","c"].map(element=>(<h1>{element}</h1>))} */}
        <Navbar active="dashboard"/>
        <Row style={{marginTop:"20px"}}>
            <Col md="10">
                <h4>AV status</h4>
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
            <Table striped bordered hover style={{marginTop:"30px"}}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Make</th>
                            <th>Color</th>
                            <th>Create Date</th>
                            <th>Status</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AVs.map((element, index) => 
                            (<tr key={element.pk}>
                                <td>{element.pk}</td>
                                <td>{element.fields.name}</td>
                                <td>{element.fields.make.charAt(0).toUpperCase()+element.fields.make.slice(1)}</td>
                                <td>{element.fields.color}</td>
                                <td>{element.fields.created_on}</td>
                                <td>{element.fields.status}</td>
                                <td style={{display:"flex"}}>
                                    <Link to={"/track/"+element.pk} className="ops-links">Track</Link>
                                    {isAdmin ?
                                    <Button className="ops-buttons" variant="danger" onClick={()=>{deleteCar(element.pk)}}>delete</Button> : <></>}
                                </td>
                            </tr>)
                        )}
                    </tbody>
                </Table>
        </Row>
        
    </Container>)
}
export default Dashboard;