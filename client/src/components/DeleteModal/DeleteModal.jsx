import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';

import "./DeleteModal.scss";

function DeleteModal({onClickOutside, onKeyDown, modalRef, buttonRef, closeModal, onSubmit, deleteString, deleteId, modalName}) {

    const handleClick=()=>{
        onSubmit(deleteId);
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
            // onClick={onClickOutside}
            onKeyDown={onKeyDown}>
                <div className="modal-area modal-delete__area" ref={modalRef} style={{backgroundImage: "url('/images/intro-background.png')"}}>
                    <div className="modal-delete__header">
                        {modalName !== "noDelete" && <h1 className="modal-title modal-delete__header-title">Are you Sure you You Would Like to Delete</h1>}
                        <h2 className= "modal-delete__header-info">{deleteString}</h2>
                        {modalName !== "noDelete" && <p className= "modal-delete__header-warning">This action can not be undone</p>}
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
                        <button onClick={closeModal}>Cancel</button>
                        {modalName !== "noDelete" && <button onClick={handleClick}>Delete</button>}
                    </div>
                </div>

            </aside>
        </FocusTrap>, document.body
    );
};

export default DeleteModal
