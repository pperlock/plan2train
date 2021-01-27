import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './Intro.scss';

import ModalContainer from '../../components/ModalContainer/ModalContainer';

class Intro extends React.Component {

    state={userInfo:{}}

    // componentDidMount(){
    //     axios.get(`http://localhost:8080/trainer/${this.state.username}/${this.state.trainerId}`)
    //     .then(res =>{
    //         this.setState({userProfile:res.data.userProfile, programs:res.data.programs},()=>{
    //             axios.get(`http://localhost:8080/trainer/${this.state.trainerId}/clients`)
    //             .then(clientRes=>{
    //                 this.setState({clients:clientRes.data})
    //             })
    //         })
    //     })
    //     console.log("trainer-componentDidMount")
    // }

    render(){
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
                    
                    <ModalContainer modalType = "logintrainer" buttonText="Trainer" information={"stuff"} onSubmitTrainer={"stuff"}/>
                    <ModalContainer modalType = "loginclient" buttonText="Client" onSubmitTrainer={"stuff"}/>
                    
                    
                    {/* <Link to="/trainerlogin"> <button className = "intro__button"> Trainer </button></Link>
                    <Link to="/clientlogin"> <button className = "intro__button"> Client </button></Link> */}
                    {/* {/* <Link to="/trainer/bharwood/600616b6c63ec047da27d59f"> <button className = "intro__button"> Trainer </button></Link> */}
                    <Link to="/trainer/bharwood/600616b6c63ec047da27d59f"> <button className = "intro__button"> Get Started </button></Link>
                </div>

            </div>
        )
    }
}

export default Intro
