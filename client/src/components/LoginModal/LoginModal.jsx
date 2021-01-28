import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import FocusTrap from 'focus-trap-react';

import "./LoginModal.scss";

import LoginForm from '../LoginForm/LoginForm';
import PersonalDetailsForm from '../PersonalDetailsForm/PersonalDetailsForm';


// {onClickOutside, onKeyDown, modalRef, buttonRef, closeModal, onSubmit, modalType}

class LoginModal extends React.Component {

    state={loginResponse:{}, showSignIn:true, showSignUp:false}

    checkCredentials=(event, profile)=>{
        event.preventDefault();

        const user = {username:event.target.username.value,profile:profile};
        this.setState({user:user});

        axios.get(`http://localhost:8080/user/${profile}/${event.target.username.value}/${event.target.password.value}`)
            .then(res =>{
                console.log(res.data);
                this.setState({loginResponse:res.data})
            })
            .catch(err =>{
                console.log(err);
            })   
    }

    toggleLoginForm = ()=>{
        this.setState({showSignUp:!this.state.showSignUp, showSignIn:!this.state.showSignIn});
    }

    render(){
        const {onKeyDown, modalRef, buttonRef, closeModal, modalType} = this.props;
        const {loggedIn, error, userId, username, profile} = this.state.loginResponse;

        const blankSignUpProfile={
            userProfile:{
                lname: "",
                fname: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                province: "",
                country:"",
                postal : "",
            }
        }
        return ReactDOM.createPortal(
            <FocusTrap>
                <aside 
                tag="aside"
                role='dialog'
                tabIndex='-1'
                aria-modal='true'
                className='modal-cover'
                // onClick={onClickOutside}
                onKeyDown={onKeyDown}>
                    <div className="modal-area modal-login__area" ref={modalRef} style={{backgroundImage: "url('/images/main5.jfif')"}}>
                        <div className="modal-login__header">
                            {modalType === "loginclient" && <h1 className="modal-title modal-login__header-title">Client Login</h1>}
                            {modalType === "logintrainer" && <h1 className= "modal-login__header-title">Trainer Login</h1>}
                            {(modalType === "logintrainer" && this.state.showSignIn) && <p className= "modal-login__header-info">Already Part of the Community? Sign In</p>}
                        </div>
                        <button
                            ref={buttonRef}
                            aria-label='Close Modal'
                            aria-labelledby="close-modal"
                            className="_modal-close modal-login__close"
                            onClick={closeModal}>
                            <span id="close-modal" className="_hide-visual">Close</span>
                            <svg className="_modal-close-icon" viewBox="0 0 40 40">
                                <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                            </svg>
                        </button>
                        <div className="modal-body modal-login__body">
                            {this.state.showSignIn &&<LoginForm onSubmit={this.checkCredentials} profile={modalType} signIn={this.state.showSignIn}/>}
                            {this.state.showSignUp && <PersonalDetailsForm onSubmit={this.checkCredentials} profile={modalType} information={blankSignUpProfile}/>}
                            {error && <p className="modal-login__body-error">{error}</p>}  
                            {this.state.noUser && <p className="modal-login__body-error">"Username Not Found"</p>}
                            {(modalType === "logintrainer" && this.state.showSignIn) && <button className="modal-login__body-signup" onClick={this.toggleLoginForm}>New to the Community? Click Here to Join Us</button>}
                        </div>
                    </div>
                    {loggedIn && <Redirect to={`/${profile}/${username}/${userId}`}></Redirect>}
                      
                   
                </aside>
            </FocusTrap>, document.body
        );
    }
}

export default LoginModal
