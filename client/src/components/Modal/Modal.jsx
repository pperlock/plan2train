import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import "./Modal.scss";

import PersonalDetailsForm from '../PersonalDetailsForm/PersonalDetailsForm';
import LessonDetailsForm from '../LessonDetailsForm/LessonDetailsForm';
import NewProgramForm from '../NewProgramForm/NewProgramForm';
import NewClientForm from '../NewClientForm/NewClientForm';

/**
 * @param {Function} onKeyDown - allows for exiting the modal with esc key 
 * @param {Function} onSubmit - function activated by button on modal - generally updates state in some way 
 * @param {Object} information - information used to fill in default values of a form - generally updating 
 * @param {String} modalName - used to conditionally render modal body (forms, etc) and title
 * @param {String} modalRef - used to add a reference to the modal through modal-area
 * @param {String} closeModal - closes the modal when cancel or "x" is clicked
 */

function Modal({onKeyDown, modalRef, buttonRef, closeModal, onSubmit, information, modalName}) {

    let modalSize="";
    if(modalName ==="updateClient"){
        modalSize= "modal-area__client"
    }else if (modalName ==="updateUser"){
        modalSize="modal-area__personal"
    } else if (modalName === "addProgram" || modalName === "updateProgram"){
        modalSize="modal-area__program"
    }else if(modalName === "addClient"){
        modalSize="modal-area__addClient"
    }else if(modalName === "modifyLesson" || modalName==="addLesson"){
        modalSize="modal-area__lesson"
    }

    return ReactDOM.createPortal(
        <FocusTrap>
            <aside className='modal-cover' onKeyDown={onKeyDown}>
                <div className={`modal-area ${modalSize}`} ref={modalRef} style={{backgroundImage: "url('/images/intro-background.png')"}}>
                    {modalName==="updateUser" && <h1 className="modal-title">Trainer Details</h1>}
                    {(modalName==="updateClient" || modalName==="addClient") && <h1 className="modal-title">Client Details</h1>}
                    {(modalName==="addProgram" || modalName==="updateProgram") && <h1 className="modal-title">Program Details</h1>}
                    {(modalName === "modifyLesson" || modalName==="addLesson") && <h1 className="modal-title">Lesson Details</h1>}
                    
                    <button
                        ref={buttonRef}
                        className="modal-close"
                        onClick={closeModal}>
                        <svg className="modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                    <div className="modal-body">
                        {(modalName ==="updateClient" || modalName==="updateUser") && <PersonalDetailsForm  onSubmit={onSubmit} closeModal={closeModal} information={information} modalName={modalName}/> }
                        {modalName === "addClient"  && <NewClientForm onSubmit={onSubmit} closeModal={closeModal} programs={information}/>}
                        {(modalName === "addProgram" || modalName === "updateProgram") && <NewProgramForm onSubmit={onSubmit} closeModal={closeModal} information={information}/>}
                        {(modalName === "modifyLesson" || modalName==="addLesson") && <LessonDetailsForm onSubmit={onSubmit} closeModal={closeModal} lesson={information} />}
                    </div>
                </div>
            </aside>
        </FocusTrap>, document.body
    );
};

export default Modal
