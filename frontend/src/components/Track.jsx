import Container from "react-bootstrap/Container";
import "../css/dashboard.css";

import Navbar from "./Navbar";
function Track(props) {
    return(
    <Container className="content-container">
        <Navbar active="track"/>
        This is track
    </Container>)
}
export default Track;