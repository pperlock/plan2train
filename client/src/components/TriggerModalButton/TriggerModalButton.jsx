import React from 'react'

import './TriggerModalButton.scss';

/**
 * @param {String} buttonText - text to put on button that triggers modal 
 * @param {Function} onSubmit - function activated by button on modal - generally updates state in some way 
 * @param {Function} showModal - displays the modal when clicked
 * @param {String} modalType - used to conditionally render the correct modal 
 * @param {String} slider - attached to the delete modal to identify the item being deleted
 * @param {String} imageURL - image to be used if the trigger button is of type "image" 
 */

function TriggerModalButton({buttonText, showModal, buttonType, imageURL, slider}) {
    return (
        <>
            {buttonType === "x" && <button className={!!slider ? "trigger-button__delete trigger-button__delete-lesson" : "trigger-button__delete"} onClick={showModal}> {buttonText} </button>}
            {buttonType === "intro" && <button className="trigger-button__intro" onClick={showModal}> {buttonText} </button>}
            {imageURL && <img className="trigger-button__image" src={imageURL} alt="button" onClick={showModal} />}
        </>
    );
};

export default TriggerModalButton
