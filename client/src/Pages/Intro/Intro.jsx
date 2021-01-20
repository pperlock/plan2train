import React from 'react';
import {Link} from 'react-router-dom';

import './Intro.scss';

function Intro() {

    //change to state and make axios to users to get username and id
    return (
        <div className="intro">
            <div className="intro__logo">
                <h1 className = "intro__logo-title" >PLAN</h1>
                <span className="intro__logo-bigLetter">2</span> 
                <h1 className="intro__logo-title"> TRAIN</h1>
            </div>
            <div className = "intro__divider"></div>
            <h2 className= "intro__subtitle"> Organizing Your Client Information</h2>
            <Link to="/trainer/bharwood/600616b6c63ec047da27d59f"> <button className = "intro__button"> Get Started </button></Link>

        </div>
    )
}

export default Intro
