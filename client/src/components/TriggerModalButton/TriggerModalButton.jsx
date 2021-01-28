import React from 'react'

import './TriggerModalButton.scss';

function TriggerModalButton({buttonText, buttonRef, showModal, buttonType, imageURL}) {

    return (
        <>
            {buttonType === "x" && <button className="trigger-button delete" ref={buttonRef} onClick={showModal}> {buttonText} </button>}
            {buttonType === "accent" && <button className="user-profile__update" ref={buttonRef} onClick={showModal}> {buttonText} </button>}
            {imageURL && <img className="trigger-button__image" ref={buttonRef} src={imageURL} alt="button" onClick={showModal} />}
        
        </>
    );
};

export default TriggerModalButton
