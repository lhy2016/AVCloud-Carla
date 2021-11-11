import Container from "react-bootstrap/Container"
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"
import AuthForm from "./AuthForm"

import "../css/landing.css"
function Landing(props) {

    return (
        <div id="site-container">
            <Container id="form-container">
                <div id="signup-login">
                    <Tabs defaultActiveKey="signup" id="landing-tabs">
                        <Tab eventKey="signup" title="Sign Up">
                            <AuthForm action="signup">
                            </AuthForm>
                        </Tab>
                        <Tab eventKey="login" title="Login">
                            <AuthForm action="login">
                            </AuthForm>
                        </Tab>
                    </Tabs>
                </div>
            </Container>
        </div>
    );
}
export default Landing;