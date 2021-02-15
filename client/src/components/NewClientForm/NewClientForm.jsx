import React, {useState} from 'react'
import axios from 'axios';

import './NewClientForm.scss';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

function NewClientForm({onSubmit, closeModal, programs}) {

    const[clientError, setClientError] = useState(null);

    const handleSubmit=(event)=>{
        event.preventDefault();
        
        axios.get(`${API_URL}/api/checkUserName/${event.target.username.value}`)
        .then(res =>{
            if (!res.data){
                setClientError(null);
                onSubmit(event);
                closeModal();
            }else{
                setClientError("Username Already Exists");
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <form id="modal-form" className="modal-form" onSubmit={handleSubmit} >
            <div className="modal-form__user">
                <div className="modal-form__section">
                    <input className="modal-form__input" id="fname" name="fname" type="text"></input>
                    <label className="modal-form__label" htmlFor="fname">First Name</label>
                </div>
                <div className="modal-form__section">
                    <input className="modal-form__input" id="lname" name="lname" type="text"></input>
                    <label className="modal-form__label" htmlFor="lname">Last Name</label>
                </div>
              
                <div className="modal-form__section">
                    <input className="modal-form__input" id="username" name="username" type="text" required></input>
                    {!clientError && <label className="modal-form__label" htmlFor="username">Username</label>}
                    {clientError && <p className="error"> {clientError}</p>}
                </div>
            
                <div className="modal-form__section">
                    <input className="modal-form__input" id="password" name="password" type="text" required></input>
                    <label className="modal-form__label" htmlFor="password">Password</label>
                </div>

                <div className="modal-form__contact">
                    <div className="modal-form__section">
                        <input className="modal-form__input modal-form__input--email" id="email" name="email" type="email"></input>
                        <label className="modal-form__label" htmlFor="email">Email</label>
                    </div>
                    <div className="modal-form__section">
                        <input className="modal-form__input" id="phone" name="phone" type="phone"></input>
                        <label className="modal-form__label" htmlFor="phone">Phone #</label>
                    </div>
                </div>
            </div>

            <div className="lesson-divider"></div>

            <div className="modal-form__address">
                <div className="modal-form__section">
                    <input className="modal-form__input modal-form__input--address" id="address" name="address" type="text"></input>
                    <label className="modal-form__label" htmlFor="address">Street</label>
                </div>
                <div className="modal-form__section">
                    <input className="modal-form__input " id="city" name="city" type="text"></input>
                    <label className="modal-form__label" htmlFor="city">City</label>
                </div>
                <div className="modal-form__section">
                    <input className="modal-form__input modal-form__input--province" id="province" name="province" type="text"></input>
                    <label className="modal-form__label" htmlFor="province">Province</label>
                </div>
                <div className="modal-form__section">
                    <input className="modal-form__input modal-form__input--country" id="country" name="country" type="text"></input>
                    <label className="modal-form__label" htmlFor="country">Country</label>
                </div>
                <div className="modal-form__section">
                    <input className="modal-form__input modal-form__input--postal" id="postal" name="postal" type="text" ></input>
                    <label className="modal-form__label" htmlFor="postal">Postal Code</label>
                </div>
            </div> 
            
            <div className="lesson-divider"></div>

            
            <div className="modal-addClient-bottom">
                <div className="modal-form__select">
                <label className="modal-form__label modal-form__label--programs" htmlFor="programs">Programs:</label>
                    <select className="modal-form__input-select" id="programs" name="programs" multiple>
                        {programs.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
                    </select>
                </div>
            
                <div className="modal-form__submit">
                    <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                    <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
                </div>
            </div>
            
        </form>
    )
}

export default NewClientForm