import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import React, { useState } from 'react'

import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom';


function AuthForm(props) {
    const [formInput, updateInput] = useState({ username: "", password: ""});
    const alert = useAlert()    
    const navigate = useNavigate();
    
    function handleFormSubmit(action) {
        axios
          .post(window.serverPrefix + "user/" + action, formInput)
          .then((response) => {
            if (response.status === 201) {
                alert.success("User created, please Login")
                props.signupCallBack("login");
                
            } else if (response.status === 200) {
                alert.success("Welcome back, " + response.data["user"]);
                var date = new Date();
                date.setDate(date.getDate() + 7);
                var dateString = date.toUTCString()
                document.cookie = "loggedUser="+response.data["user"]+"; expires="+dateString+"; path=/";
                document.cookie = "userId="+response.data["id"]+"; expires="+dateString+"; path=/";
                
                navigate('/dashboard')
            }
            updateInput({username:"", password:""})
          })
          .catch((err) => {
              console.log(err.response.data)
              alert.error("Error "+err.response.status.toString()+": "+err.response.data["error"]);
          });
    }

    const updateFormInput = (name, value) => {
        updateInput({ ...formInput, [name]: value});
    }

    return (
        <Form className='landing-form'>
            <Form.Group className="mb-3" controlId={props.action + "username"}>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter Username" onChange={(e) => {updateFormInput("username", e.target.value)}} value={formInput.username}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId={props.action + "password"}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" onChange={(e) => {updateFormInput("password", e.target.value)}} value={formInput.password}/>
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