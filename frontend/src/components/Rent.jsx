import Container from "react-bootstrap/Container";
import "../css/dashboard.css";

import Navbar from "./Navbar";
function Rent(props) {
    return(
    <Container className="content-container">
        <Navbar active="rent"/>
        this is rent
    </Container>)
}
export default Rent;