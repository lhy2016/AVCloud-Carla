import Container from "react-bootstrap/Container";
import "../css/dashboard.css";

import Navbar from "./Navbar";
function Dashboard(props) {
    return(
    <Container className="content-container">
        <Navbar active="dashboard"/>
        this is dashboard
    </Container>)
}
export default Dashboard;