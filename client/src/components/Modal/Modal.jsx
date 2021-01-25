import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import "./Modal.scss";

import PersonalDetailsForm from '../PersonalDetailsForm/PersonalDetailsForm';
import LessonDetailsForm from '../LessonDetailsForm/LessonDetailsForm';
import NewProgramForm from '../NewProgramForm/NewProgramForm';
import NewClientForm from '../NewClientForm/NewClientForm';

function Modal({onClickOutside, onKeyDown, modalRef, buttonRef, closeModal,onSubmit, information, modalName}) {
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
                <div className="modal-area" ref={modalRef} style={{backgroundImage: "url('/images/intro-background.png')"}}>
                    <h1 className="modal-title">Personal Details</h1>
                    <button
                        ref={buttonRef}
                        aria-label='Close Modal'
                        aria-labelledby="close-modal"
                        className="_modal-close"
                        onClick={closeModal}>
                        <span id="close-modal" className="_hide-visual">Close</span>
                        <svg className="_modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                    <div className="modal-body">
                        {(modalName ==="updateClient" || modalName==="updateUser") && <PersonalDetailsForm  onSubmit={onSubmit} closeModal={closeModal} information={information} modalName={modalName}/> }
                        {modalName === "addClient" && <NewClientForm onSubmit={onSubmit} closeModal={closeModal} programs={information}/>}
                        {modalName === "addProgram" && <NewProgramForm onSubmit={onSubmit} closeModal={closeModal} />}
                        {modalName === "modifyLesson" && <LessonDetailsForm onSubmit={onSubmit} closeModal={closeModal} lesson={information} />}
                    </div>
                </div>

            </aside>
        </FocusTrap>, document.body
    );
};

export default Modal
