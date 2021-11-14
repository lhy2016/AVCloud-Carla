import {Badge, Row, Col, Button, NavLink} from "react-bootstrap";
import React, {useState} from "react";
import { getCookie, isAdminLoggedIn } from "../js/utilities";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
function Navbar(props) {
    const loggedUser = getCookie("loggedUser")
    const navigate = useNavigate();
    function logout() {
        document.cookie = "loggedUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
    }
    return (
        <Row className='color-row'>
            <Col md="3" style={{display:"flex"}}>
                <div className="row-flex ">
                    Hello, <span className='loggedUser-text'>{loggedUser}</span>
                    <Badge bg="info">{loggedUser === "admin" ? "Administrator" : "Public User"}</Badge>
                </div>
            </Col>
            <Col md="7" className="nav-link-container">
                <Link to="/dashboard" className={props.active == "dashboard" ? "active":""}>Dashboard</Link>
                <Link to="/rent" className={props.active == "rent" ? "active":""}>Rent</Link>
                <Link to="/track" className={props.active == "track" ? "active":""}>Track</Link>
                { isAdminLoggedIn() ?
                    <Link to="/maintenancerecord" className={props.active == "maintenancerecord" ? "active":""}>
                        Maintenance Record
                    </Link>
                    :
                    undefined
                }
            </Col>
            <Col><Button variant="secondary" onClick={logout}>Log out</Button></Col>
        </Row>
    )
}
export default Navbar;