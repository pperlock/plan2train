import React from 'react';

import './Intro.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';

function Intro () {
    // introduction page rendered when app loads
    return (
        <div className="intro" style={{backgroundImage: "url('/images/intro-background.png')"}}>
            {/* renders app logo */}
            <div className="intro__logo">
                <h1 className = "intro__logo-title" >PLAN</h1>
                <span className="intro__logo-bigLetter">2</span> 
                <h1 className="intro__logo-title"> TRAIN</h1>
            </div>
            <div className = "intro__divider"></div>
            <h2 className= "intro__subtitle"> Organize Your Program Information and Communicate with Your Clients </h2>
            <h2>Choose your Profile</h2>
            <div className = "intro__login">
                {/* trainer login */}
                <div className = "intro__login-button-left">
                    <ModalContainer modalType = "logintrainer" buttonText="Trainer" buttonType="intro"/>
                </div>
                {/* client login */}
                <div className = "intro__login-button">
                    <ModalContainer modalType = "loginclient" buttonText="Client" buttonType="intro"/>
                </div>
            </div>
        </div>
    )
}

export default Intro
