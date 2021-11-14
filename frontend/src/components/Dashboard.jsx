import Container from "react-bootstrap/Container";
import {Badge, Row, Col, Button} from "react-bootstrap";
import "../css/dashboard.css";
import { useNavigate } from "react-router";
import {getCookie} from "../js/utilities";
function Dashboard() {
    const navigate = useNavigate();
    
    function logout() {
        document.cookie = "loggedUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
    }
    const loggedUser = getCookie("loggedUser")
    return(
    <Container id="dashboard-container">
        <Row className='color-row'>
            <Col md="10" style={{display:"flex"}}>
                <div className="row-flex ">
                    Hello, <span class='loggedUser-text'>{loggedUser}</span>
                    <Badge bg="info">{loggedUser === "admin" ? "Administrator" : "Public User"}</Badge>
                </div>
            </Col>
            <Col><Button variant="secondary" onClick={logout}>Log out</Button></Col>
        </Row>
    </Container>)
}
export default Dashboard;