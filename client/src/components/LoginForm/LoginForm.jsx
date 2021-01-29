import React from 'react';

import './LoginForm.scss';

function LoginForm({onSubmit, profile, signIn}) {
    
    const profileType = profile.substring(5, profile.length);
        
    if(!!signIn){
        return (
            <form id="login-form" className="login__form" onSubmit={(event)=> onSubmit(event, profileType)} >
                <div className="login__form-input">
                    <input className="modal-form__input login__form-inputbox" id="username" name="username" type="text" placeholder="Username" required></input>
                    <input className="modal-form__input login__form-inputbox" id="password" name="password" type="password" placeholder="Password" required></input>
                </div>
                <button className="modal-form__submit-button login__form-submit" id="submit" type="submit" form="login-form">Sign In</button>
            </form>
        )
    }else{
        return(
            <form id="login-form" className="login__form" onSubmit={onSubmit} >
                <div className="login__form-input">
                    <input className="modal-form__input login__form-inputbox" id="username" name="username" type="text" placeholder="Username" required></input>
                    <input className="modal-form__input login__form-inputbox" id="password" name="password" type="password" placeholder="Password" required></input>
                    <input className="modal-form__input login__form-inputbox" id="email" name="email" type="email" placeholder="Email" required></input>
                    <input className="modal-form__input login__form-inputbox" id="fname" name="fname" type="text" placeholder="First Name" required></input>
                    <input className="modal-form__input login__form-inputbox" id="lname" name="lname" type="lname" placeholder="Last Name" required></input>
                    
                </div>
                <button className="modal-form__submit-button login__form-submit" id="submit" type="submit" form="login-form">Join Us</button>
            </form>
        )
    }
}

export default LoginForm
