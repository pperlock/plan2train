import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import LoginForm from '../LoginForm/LoginForm';


function LoginModal({onClickOutside, onKeyDown, modalRef, buttonRef, closeModal, onSubmit, modalType}) {

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
                <div className="modal-area modal-delete__area" ref={modalRef} style={{backgroundImage: "url('/images/intro-background.png')"}}>
                    <div className="modal-delete__header">
                        {modalType === "loginclient" && <h1 className="modal-title modal-delete__header-title">Client Login</h1>}
                        {modalType === "logintrainer" && <p className= "modal-delete__header-warning">Trainer Login</p>}
                    </div>
                    <button
                        ref={buttonRef}
                        aria-label='Close Modal'
                        aria-labelledby="close-modal"
                        className="_modal-close modal-delete__close"
                        onClick={closeModal}>
                        <span id="close-modal" className="_hide-visual">Close</span>
                        <svg className="_modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                    <div className="modal-body modal-delete__body">
                        <LoginForm onSubmit={onSubmit} closeModal={closeModal} profile={modalType}/>
                    </div>
                </div>

            </aside>
        </FocusTrap>, document.body
    );
}

export default LoginModal
