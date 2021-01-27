import React from 'react'

import './TriggerModalButton.scss';

function TriggerModalButton({buttonText, buttonRef, showModal, buttonType}) {

    return (
        <>
            {buttonType === "x" && <button className="trigger-button delete" ref={buttonRef} onClick={showModal}> {buttonText} </button>}
            {buttonType === "accent" && <button className="user-profile__update" ref={buttonRef} onClick={showModal}> {buttonText} </button>}
        
        </>
    );
};

export default TriggerModalButton
