import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import FocusTrap from 'focus-trap-react';

import "./LoginModal.scss";

import LoginForm from '../LoginForm/LoginForm';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:8080';

function LoginModal ({onClickOutside, onKeyDown, modalRef, buttonRef, closeModal, onSubmit, modalType, toggleScrollLock}) {

    
    const [showSignIn, setShowSignIn] = useState(true);
    const [showSignUp, setShowSignUp] = useState(false);
  
    const [loginResponse, setLoginResponse] = useState({}); //PRETTY MUCH THE SAME AS TUTORIAL


    //triggered by the log in form submit check the credentials and store response in state
    const checkCredentials=(event, profile)=>{
        event.preventDefault();

        console.log(profile);
        const user = {username:event.target.username.value, password:event.target.password.value};

        axios.post(`${API_URL}/login`, user, {withCredentials:true})
        .then(res =>{
            if (res.data.loggedIn && res.data.profile !== profile) {
                setLoginResponse({loggedIn:false, error:"Incorrect Profile Type"});
            }else{
                setLoginResponse(res.data);
            }
        })
        .catch(err =>{
            console.log(err);
        }) 
        toggleScrollLock(); 
    }

    const googleSignIn=()=>{
        window.location.href = `${API_URL}/auth/google`;
        const response = window.json;
        console.log("reached");
        console.log(response);
     }


    //triggered by the sign up form submit
    const createTrainer = (event)=>{
        event.preventDefault();
        
        const {username, password, email, fname, lname} = event.target;

        const newTrainer={
            username:username.value,
            password:password.value,
            email:email.value,
        }

        axios.post(`${API_URL}/addTrainer`, newTrainer, {withCredentials:true})
        .then(res =>{
            setLoginResponse(res.data);
            console.log(res.data);
        })
        .catch(err =>{
            console.log(err);
        })
        toggleScrollLock(); 
    }

    //used to show either the signup form or the log in form
    const toggleLoginForm = ()=>{
        setShowSignUp(!showSignUp);
        setShowSignIn(!showSignIn);
    }

        const {loggedIn, error, userId, profile} = loginResponse;

        console.log(loginResponse);

        return ReactDOM.createPortal(
            <FocusTrap>
                <aside 
                className='modal-cover'
                // onClick={onClickOutside}
                onKeyDown={onKeyDown}>
                    <div className="modal-area modal-login__area" ref={modalRef} style={{backgroundImage: "url('/images/main5.jfif')"}}>
                        <div className="modal-login__header">
                            {modalType === "loginclient" && <h1 className="modal-title modal-login__header-title">Client Login</h1>}
                            {modalType === "logintrainer" && <h1 className= "modal-login__header-title">Trainer Login</h1>}
                            {(modalType === "logintrainer" && showSignIn) && <p className= "modal-login__header-info">Already Part of the Community? Sign In</p>}
                        </div>
                        <button
                            ref={buttonRef}
                            className="modal-close modal-login__close"
                            onClick={closeModal}>
                            <svg className="modal-close-icon" viewBox="0 0 40 40">
                                <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                            </svg>
                        </button>
                        <div className="modal-body modal-login__body">
                            {showSignIn &&<LoginForm onSubmit={checkCredentials} googleSignIn={googleSignIn} profile={modalType} signIn={showSignIn} closeModal={closeModal}/>}
                            {showSignUp && <LoginForm onSubmit={createTrainer} profile={modalType} signIn={showSignIn} closeModal={closeModal}/>}
                            {error && <p className="modal-login__body-error">{error}</p>}  
                            {(modalType === "logintrainer" && showSignIn) && <button className="modal-login__body-signup" onClick={toggleLoginForm}>New to the Community? Click Here to Join Us</button>}
                        </div>
                    </div>
                    {loggedIn && <Redirect to={`/${profile}/${userId}`}></Redirect>}
                </aside>
            </FocusTrap>, document.body
        );
}

export default LoginModal
