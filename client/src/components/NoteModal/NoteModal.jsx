import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import "./NoteModal.scss";

function NoteModal({onKeyDown, modalRef, buttonRef, closeModal, onSubmit, information, modalName}) {

    const [note, setNote]=useState(information);

    const handleChange = (event)=>{
        setNote(event.target.value);
    }

    const handleSubmit=(event)=>{
        event.preventDefault();
        onSubmit(note,modalName);
        closeModal();
    }

    return ReactDOM.createPortal(
        <FocusTrap>
            <aside 
            tag="aside"
            role='dialog'
            tabIndex='-1'
            aria-modal='true'
            className='modal-cover'
            onKeyDown={onKeyDown}>
                <div className="modal-area modal-note__area" ref={modalRef}>
                    <div className="modal-note__header">
                        <form className="modal-note__header-form" name="noteForm" onSubmit={handleSubmit}>                            
                            <textarea value={note} onChange={handleChange} className="modal-note__header-form-input" form="noteForm" wrap="hard" name="newNote" id="newNote" placeholder="New Note" rows="15" cols="52">{note}</textarea>
                            <button type="submit" className=" modal-note__header-form-submit"> Enter </button>
                        </form>
                    </div>
                    <img className="modal-note__image" src="/images/typewriter.png" alt="typewriter"/>
                    <button
                        ref={buttonRef}
                        aria-label='Close Modal'
                        aria-labelledby="close-modal"
                        className="_modal-close modal-note__close"
                        onClick={closeModal}>
                        <span id="close-modal" className="_hide-visual">Close</span>
                        <svg className="_modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                </div>

            </aside>
        </FocusTrap>, document.body
    );
};

export default NoteModal
