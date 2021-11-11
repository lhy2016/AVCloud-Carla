import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import React, { useState } from 'react'
import "../js/config"


function AuthForm(props) {
    const [formInput, updateInput] = useState({ username: "", password: ""})
    const username = formInput.username
    const password = formInput.password

    function handleFormSubmit(action) {
        axios
          .post(window.serverPrefix + action, formInput)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    function updateFormInput(name, value) {
        updateInput( (previous) => {
            previous[name] = value
            return previous
        })
    }

    return (
        <Form className='landing-form'>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter Username" onChange={(e) => {updateFormInput("username", e.target.value)} } />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" onChange={(e) => {updateFormInput("password", e.target.value)} }/>
            </Form.Group>
            {props.action === "login" ? 
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group> : 
                <></>}
            
            <Button variant="primary" onClick={(event)=> {handleFormSubmit(props.action)}}>
                {props.action === "login" ? "Login" : "Join AVCloud"}
            </Button>
        </Form>
    );
}
export default AuthForm;