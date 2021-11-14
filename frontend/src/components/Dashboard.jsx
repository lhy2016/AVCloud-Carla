import { Row, Col, Button, Modal, Form} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../css/dashboard.css";
import React, {useState} from "react";
import Navbar from "./Navbar";
import axios from "axios"


function Dashboard(props) {
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
            console.log(response.data)
        })
        .catch((err)=> {
            console.log(err.response)
        });
        updateCar(defaultCar);
        handleClose()
    }
    return(
    <Container className="content-container">
        <Navbar active="dashboard"/>
        <Row style={{marginTop:"20px"}}>
            <Col md="10">
                <h4>AV status</h4>
            </Col>
            <Col>
                <Button variant="warning" onClick={handleShow}>Add a New AV</Button>
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
        </Row>
    </Container>)
}
export default Dashboard;