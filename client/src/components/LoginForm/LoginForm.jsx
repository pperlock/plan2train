import React from 'react';

import './LoginForm.scss';

function LoginForm({onSubmit, closeModal, profile, lesson}) {
    if (profile === "trainerlogin"){
        return (
            <form id="modal-form" className="modal-form" onSubmit={onSubmit} >
                <div>
                    <input className="modal-form__input" id="username" name="username" type="text" placeholder="Username"></input>
                    <input className="modal-form__input" id="password" name="password" type="password" placeholder="Password"></input>
                </div>
                <div className="modal-form__submit">
                    <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                    <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
                </div>
                
            </form>
        )
    }else{
        return (
            <form id="modal-form" className="modal-form" onSubmit={onSubmit} >
                <div>
                    <input className="modal-form__input" id="username" name="username" type="text" placeholder="Username"></input>
                    <input className="modal-form__input" id="password" name="password" type="password" placeholder="Password"></input>
                </div>
                <div className="modal-form__submit">
                    {/* <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button> */}
                    <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Sign In</button>
                </div>
                
            </form>
        )
    }
}

export default LoginForm
