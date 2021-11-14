import Container from "react-bootstrap/Container"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import AuthForm from "./AuthForm"
import {useNavigate} from "react-router-dom"

import "../css/landing.css"
import React, { useState } from 'react'

function Landing(props) {
    const navigate = useNavigate();
 
    const [curTab, updateTab] = useState("login")

    function toogleTab(tab) {
        updateTab(previous=>tab);
    }
    return (
        
            <Container id="form-container">
                <div id="signup-login">
                    <Tabs id="landing-tabs"
                        activeKey={curTab}
                        onSelect={(key)=> {updateTab( (previous) => {return key} )}}
                    >
                        <Tab eventKey="signup" title="Sign Up" > 
                            <AuthForm action="signup" signupCallBack={toogleTab}>
                            </AuthForm>
                        </Tab>
                        <Tab eventKey="login" title="Login" >
                            <AuthForm action="login">
                            </AuthForm>
                        </Tab>
                    </Tabs>
                </div>
            </Container>
        
    );
}
export default Landing;