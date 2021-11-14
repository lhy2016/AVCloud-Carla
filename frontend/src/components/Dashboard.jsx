import { Row, Col, Button, Modal} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../css/dashboard.css";
import React, {useState} from "react";
import Navbar from "./Navbar";
function Dashboard(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Add
                    </Button>
                    </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    </Container>)
}
export default Dashboard;