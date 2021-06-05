import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import "./DeleteModal.scss";

function DeleteModal({onKeyDown, closeModal, onSubmit, deleteString, deleteId, modalName}) {

    const handleClick=()=>{
        onSubmit(deleteId);
        closeModal();
    }

    return ReactDOM.createPortal(
        <FocusTrap>
            <aside 
            className='modal-cover'
            onKeyDown={onKeyDown}>
                <div className="modal-area modal-delete__area" style={{backgroundImage: "url('/images/intro-background.png')"}}>
                    <div className="modal-delete__header">
                        {modalName !== "noDelete" && <h1 className="modal-title modal-delete__header-title">Are you Sure you You Would Like to Delete</h1>}
                        <h2 className= {modalName !== "noDelete" ? "modal-delete__header-info" : "modal-delete__header-noDelete"} >{deleteString}</h2>
                        {modalName === "noDelete" && <p className="modal-delete__header-noDelete-instructions"> Change Another Lesson to "Next" To Delete</p>}
                        {modalName === "deleteProgram" && <h1 className="modal-title modal-delete__header-title">And All It's Resources?</h1>}
                        {modalName !== "noDelete" && <p className= "modal-delete__header-warning">This action can not be undone</p>}
                        {modalName === "deleteResource" && <p className="modal-delete__header-resource-instructions"> This resource will still be availble in any lessons where applied until removed from lesson resources</p>}
                    </div>
                    <button
                        className="modal-close modal-delete__close"
                        onClick={closeModal}>
                        <svg className="modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                    <div className="modal-body modal-delete__body">
                        <button className="modal-form__submit-cancel" onClick={closeModal}>Cancel</button>
                        {modalName !== "noDelete" && <button className="modal-form__submit-button" onClick={handleClick}>Delete</button>}
                    </div>
                </div>

            </aside>
        </FocusTrap>, document.body
    );
};

export default DeleteModal
