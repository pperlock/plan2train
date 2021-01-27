import React from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import './Intro.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';

function Intro () {
    return (
        <div className="intro">
            <div className="intro__logo">
                <h1 className = "intro__logo-title" >PLAN</h1>
                <span className="intro__logo-bigLetter">2</span> 
                <h1 className="intro__logo-title"> TRAIN</h1>
            </div>
            <div className = "intro__divider"></div>
            <h2 className= "intro__subtitle"> Organize Your Program Information and Communicate with Your Clients </h2>
            <h2>Choose your Profile</h2>
            <div>
                <ModalContainer modalType = "logintrainer" buttonText="Trainer" buttonType="accent"/>
                <ModalContainer modalType = "loginclient" buttonText="Client" buttonType="accent"/>
            </div>
        </div>
    )
}

export default Intro
