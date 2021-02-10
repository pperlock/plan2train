import React from 'react';

import './LoginForm.scss';

function LoginForm({onSubmit, profile, signIn, googleSignIn}) {
    
    const profileType = profile.substring(5, profile.length);
        
    if(!!signIn){
        return (
            <div>
                <form id="login-form" className="login__form" onSubmit={(event)=> onSubmit(event, profileType)} >
                    <div className="login__form-input">
                        <input className="modal-form__input login__form-inputbox" id="username" name="username" type="text" placeholder="Username" required></input>
                        <input className="modal-form__input login__form-inputbox" id="password" name="password" type="password" placeholder="Password" required></input>
                    </div>
                    <button className="modal-form__submit-button login__form-submit" id="submit" type="submit" form="login-form">Sign In</button>
                </form>
                <div className="login-divider">
                    <div className="login-divider__line"></div>
                    <p className="login-divider__text"> OR</p>
                    <div className="login-divider__line"></div>
                </div>
                <button onClick={googleSignIn} className="social-login" id="google" type="button" form="login-form"><img className="social-login__icon" src="/icons/google.png"></img></button>
            </div>
        )
    }else{
        return(
            <>
                <form id="login-form" className="login__form" onSubmit={onSubmit} >
                    <div className="login__form-input">
                        <input className="modal-form__input login__form-inputbox" id="username" name="username" type="text" placeholder="Username" required></input>
                        <input className="modal-form__input login__form-inputbox" id="password" name="password" type="password" placeholder="Password" required></input>
                        <input className="modal-form__input login__form-inputbox" id="email" name="email" type="email" placeholder="Email" required></input>
                    </div>
                    <button className="modal-form__submit-button login__form-submit" id="submit" type="submit" form="login-form">Join Us</button>
                </form>
                <button onClick={googleSignIn} className="social-login" id="google" type="button" form="login-form"><img className="social-login__icon" src="/icons/google.png"></img></button>
            </>
        )
    }
}

export default LoginForm
