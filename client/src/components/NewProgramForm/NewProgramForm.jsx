import React from 'react'
import "./NewProgramForm.scss";

function NewProgramForm({onSubmit, closeModal, information}) {
    const handleSubmit=(event)=>{
        onSubmit(event);
        closeModal();
    }
    return (
        <form id="modal-form" className="modal-form" onSubmit={handleSubmit} >
            <div className="new-program__input">
                <input className="modal-form__input new-program__text" id="programName" name="programName" type="text" placeholder="Enter Program Name" required></input>
                <textarea className="modal-form__input new-program__textarea" form="modal-form" wrap="hard" name="programDescription" id="programDescription" placeholder="Enter Program Description" rows="10" cols="150"></textarea>
            </div>
            
            <div className="modal-form__submit">
                <button className="modal-form__submit-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="modal-form__submit-button" id="submit" type="submit" form="modal-form">Submit</button>
            </div>
            
        </form>
    )
}

export default NewProgramForm
