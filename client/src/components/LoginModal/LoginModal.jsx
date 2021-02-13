import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import FocusTrap from 'focus-trap-react';

import "./LoginModal.scss";

import LoginForm from '../LoginForm/LoginForm';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

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
     }

    const facebookSignIn=()=>{
        window.location.href = `${API_URL}/auth/facebook`;
        console.log("reached");
    }


    //triggered by the sign up form submit
    const createTrainer = (event)=>{
        event.preventDefault();
        
        const {username, password} = event.target;

        const newTrainer={
            username:username.value,
            password:password.value,
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
        setLoginResponse({loggedIn:false, error:""});
    }

        const {loggedIn, error, userId, profile} = loginResponse;

        console.log(loginResponse);

        const profileType = modalType.substring(5, modalType.length);
 
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
                            {(profileType === "trainer" && showSignIn) && <button className="modal-login__body-signup" onClick={toggleLoginForm}>New to the Community? <span className="modal-login__body-signup-accent">Sign Up</span></button>}
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
                            {showSignIn && <LoginForm onSubmit={checkCredentials} profile={profileType} signIn={showSignIn} closeModal={closeModal}/>}
                            {showSignUp && <LoginForm onSubmit={createTrainer} profile={profileType} signIn={showSignIn} closeModal={closeModal}/>}
                            {error && <p className={showSignIn ? "modal-login__body-error" : "modal-login__body-error modal-login__body-error--signUp"}>{error}</p>}  
                            {profileType==="trainer" &&
                            <>
                            <div className="login-divider">
                                <div className="login-divider__line"></div>
                                <p className="login-divider__text"> OR</p>
                                <div className="login-divider__line"></div>
                            </div>
                            <div className="modal-login__alternate">
                                {/* <button onClick={googleSignIn} className="social-login" id="google" type="button" form="login-form"> */}
                                    <img className="social-login__icon" onClick={googleSignIn} src="/icons/google.png" alt="google signin"></img>
                                {/* </button> */}
                                <p className="modal-login__alternate-text"> {showSignIn ? "Login With Google" : "Sign Up With Google"}</p>
                            </div>
                            <div className="modal-login__alternate">
                                {/* <button onClick={googleSignIn} className="social-login social-login-facebook" id="google" type="button" form="login-form"> */}
                                    <img className="social-login__icon" onClick={facebookSignIn} src="/icons/facebook-icon-square.png" alt="google signin"></img>
                                {/* </button> */}
                                <p className="modal-login__alternate-text">{showSignIn ? "Login With Facebook" : "Sign Up With Facebook"}</p>
                            </div>
                            </>}
                        </div>
                    </div>
                    {loggedIn && <Redirect to={`/${profile}/${userId}`}></Redirect>}
                </aside>
            </FocusTrap>, document.body
        );
}

export default LoginModal
